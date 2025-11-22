import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Only require email, password is optional for free login
    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      )
    }

    // Try to find existing user
    let user = await getUserByEmail(email)

    // If user doesn't exist, create a new one
    if (!user) {
      // Extract name from email (part before @) or use default
      const nameFromEmail = email.split('@')[0] || 'User'
      const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)

      try {
        user = await prisma.user.create({
          data: {
            email,
            name: capitalizedName,
            password: null, // No password needed for free login
          },
        })
      } catch (dbError: any) {
        // If database connection fails, provide helpful error
        if (dbError.code === 'P1001' || dbError.message?.includes('connect')) {
          console.error('Database connection error:', dbError)
          return NextResponse.json(
            { 
              error: 'Database connection failed. Please check your DATABASE_URL environment variable.',
              hint: 'For Vercel deployment, you need a cloud database like Turso (libsql) or PostgreSQL.'
            },
            { status: 503 }
          )
        }
        throw dbError
      }
    }

    // Set session cookie (simplified - in production use proper session management)
    const cookieStore = await cookies()
    cookieStore.set('user-id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    // Return more detailed error in development, generic in production
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message || 'Internal server error'
      : 'Internal server error'
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}



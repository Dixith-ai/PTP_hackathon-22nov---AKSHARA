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

      user = await prisma.user.create({
        data: {
          email,
          name: capitalizedName,
          password: null, // No password needed for free login
        },
      })
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
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



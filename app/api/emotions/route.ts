import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user-id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { mood, intensity, notes } = await req.json()

    const emotion = await prisma.emotion.create({
      data: {
        userId,
        mood,
        intensity: intensity || 5,
        notes,
      },
    })

    return NextResponse.json({ emotion })
  } catch (error) {
    console.error('Error creating emotion:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



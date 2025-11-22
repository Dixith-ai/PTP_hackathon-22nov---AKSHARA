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

    const body = await req.json()
    const { learningStyle, studyHours, goals, interests, initialMood, firstHabit } = body

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        learningStyle,
        studyHours,
        goals,
        interests,
      },
    })

    // Create initial emotion
    if (initialMood) {
      await prisma.emotion.create({
        data: {
          userId,
          mood: initialMood,
          intensity: 5,
        },
      })
    }

    // Create first habit
    if (firstHabit) {
      await prisma.habit.create({
        data: {
          userId,
          title: firstHabit,
          type: 'daily',
          difficulty: 'easy',
        },
      })
    }

    // Create initial streak
    await prisma.streak.create({
      data: {
        userId,
        type: 'daily',
        count: 1,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



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

    const { habitId } = await req.json()

    // Create completion
    await prisma.habitCompletion.create({
      data: {
        habitId,
        completedAt: new Date(),
      },
    })

    // Update or create streak
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const streak = await prisma.streak.findFirst({
      where: {
        userId,
        habitId,
        lastDate: {
          gte: today,
        },
      },
    })

    if (streak) {
      // Already completed today
      return NextResponse.json({ success: true, message: 'Already completed today' })
    }

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const yesterdayStreak = await prisma.streak.findFirst({
      where: {
        userId,
        habitId,
        lastDate: {
          gte: yesterday,
          lt: today,
        },
      },
    })

    if (yesterdayStreak) {
      // Continue streak
      await prisma.streak.update({
        where: { id: yesterdayStreak.id },
        data: {
          count: yesterdayStreak.count + 1,
          lastDate: new Date(),
        },
      })
    } else {
      // New streak
      await prisma.streak.create({
        data: {
          userId,
          habitId,
          type: 'habit',
          count: 1,
          lastDate: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing habit:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



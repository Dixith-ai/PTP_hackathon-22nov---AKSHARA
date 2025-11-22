import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user-id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const mistakes = await prisma.mistake.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Get lesson info if lessonId exists
    const mistakesWithLessons = await Promise.all(
      mistakes.map(async (mistake) => {
        if (mistake.lessonId) {
          const lesson = await prisma.lesson.findUnique({
            where: { id: mistake.lessonId },
            include: {
              course: {
                select: {
                  title: true,
                },
              },
            },
          })
          return { ...mistake, lesson }
        }
        return { ...mistake, lesson: null }
      })
    )

    return NextResponse.json({ mistakes: mistakesWithLessons })
  } catch (error) {
    console.error('Error fetching mistakes:', error)
    return NextResponse.json({ mistakes: [] })
  }
}


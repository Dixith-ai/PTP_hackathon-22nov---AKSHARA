import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; lessonId: string } }
) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user-id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mark lesson as completed
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: params.lessonId,
        },
      },
      update: {
        completed: true,
        progress: 100,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId: params.lessonId,
        completed: true,
        progress: 100,
        completedAt: new Date(),
      },
    })

    // Update course progress
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: { lessons: true },
    })

    if (course) {
      const completedLessons = await prisma.lessonProgress.count({
        where: {
          userId,
          lessonId: { in: course.lessons.map((l) => l.id) },
          completed: true,
        },
      })

      const courseProgress = (completedLessons / course.lessons.length) * 100

      await prisma.enrollment.updateMany({
        where: {
          userId,
          courseId: params.id,
        },
        data: {
          progress: courseProgress,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing lesson:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



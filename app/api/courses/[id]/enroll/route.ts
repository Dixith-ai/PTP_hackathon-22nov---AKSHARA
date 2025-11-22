import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user-id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: params.id,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Already enrolled' }, { status: 400 })
    }

    // Create enrollment
    await prisma.enrollment.create({
      data: {
        userId,
        courseId: params.id,
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'course',
        title: 'Course Enrolled!',
        message: 'You successfully enrolled in a new course. Start learning now!',
        link: `/courses/${params.id}`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error enrolling in course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



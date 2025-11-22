import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        _count: {
          select: { lessons: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formattedCourses = courses.map((course) => ({
      id: course.id,
      title: course.title,
      tagline: course.tagline,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
      duration: course.duration,
      lessonCount: course._count.lessons,
      image: course.image,
    }))

    return NextResponse.json({ courses: formattedCourses })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



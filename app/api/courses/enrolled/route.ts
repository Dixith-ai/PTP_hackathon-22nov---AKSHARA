import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user-id')?.value

    if (!userId) {
      return NextResponse.json({ courses: [] })
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: true,
      },
    })

    return NextResponse.json({
      courses: enrollments.map((e) => e.course),
    })
  } catch (error) {
    return NextResponse.json({ courses: [] })
  }
}



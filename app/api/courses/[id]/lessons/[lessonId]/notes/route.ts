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

    const { content } = await req.json()

    await prisma.note.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: params.lessonId,
        },
      },
      update: {
        content,
      },
      create: {
        userId,
        lessonId: params.lessonId,
        content,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving notes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



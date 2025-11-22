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

    const { type } = await req.json()

    // Check if reaction exists
    const existing = await prisma.reaction.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: params.id,
        },
      },
    })

    if (existing) {
      // Remove reaction
      await prisma.reaction.delete({
        where: {
          userId_postId: {
            userId,
            postId: params.id,
          },
        },
      })
      return NextResponse.json({ success: true, removed: true })
    } else {
      // Create reaction
      await prisma.reaction.create({
        data: {
          userId,
          postId: params.id,
          type: type || 'like',
        },
      })
      return NextResponse.json({ success: true, added: true })
    }
  } catch (error) {
    console.error('Error toggling reaction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



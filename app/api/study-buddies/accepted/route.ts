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

    const buddies = await prisma.studyBuddy.findMany({
      where: {
        OR: [
          { userId, status: 'accepted' },
          { buddyId: userId, status: 'accepted' },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            bio: true,
          },
        },
        buddy: {
          select: {
            id: true,
            name: true,
            username: true,
            bio: true,
          },
        },
      },
    })

    const formattedBuddies = buddies.map((b) => ({
      id: b.userId === userId ? b.buddy.id : b.user.id,
      name: b.userId === userId ? b.buddy.name : b.user.name,
      username: b.userId === userId ? b.buddy.username : b.user.username,
      bio: b.userId === userId ? b.buddy.bio : b.user.bio,
      compatibility: b.compatibility,
    }))

    return NextResponse.json({ buddies: formattedBuddies })
  } catch (error) {
    console.error('Error fetching accepted buddies:', error)
    return NextResponse.json({ buddies: [] })
  }
}



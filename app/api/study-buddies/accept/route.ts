import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { calculateCompatibility } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user-id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { buddyId } = await req.json()

    // Get both users for compatibility calculation
    const [user, buddy] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.user.findUnique({ where: { id: buddyId } }),
    ])

    if (!user || !buddy) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const compatibility = calculateCompatibility(user, buddy)

    // Create buddy connection
    await prisma.studyBuddy.create({
      data: {
        userId,
        buddyId,
        status: 'accepted',
        compatibility,
      },
    })

    // Create notifications for both users
    await Promise.all([
      prisma.notification.create({
        data: {
          userId: buddyId,
          type: 'buddy',
          title: 'New Study Buddy! 🎉',
          message: `${user.name} wants to be your study buddy!`,
          link: '/study-buddy',
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error accepting buddy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



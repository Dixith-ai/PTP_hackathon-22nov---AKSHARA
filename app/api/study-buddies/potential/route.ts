import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { calculateCompatibility } from '@/lib/utils'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user-id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ buddies: [] })
    }

    // Get existing buddy connections
    const existingConnections = await prisma.studyBuddy.findMany({
      where: {
        OR: [
          { userId },
          { buddyId: userId },
        ],
      },
    })

    const connectedUserIds = new Set([
      userId,
      ...existingConnections.map((c) => c.userId),
      ...existingConnections.map((c) => c.buddyId),
    ])

    // Find potential buddies (not already connected)
    const potentialBuddies = await prisma.user.findMany({
      where: {
        id: {
          notIn: Array.from(connectedUserIds),
        },
        learningStyle: {
          not: null,
        },
      },
      take: 10,
    })

    // Calculate compatibility and format
    const buddiesWithCompatibility = potentialBuddies.map((buddy) => ({
      id: buddy.id,
      name: buddy.name,
      username: buddy.username,
      bio: buddy.bio,
      learningStyle: buddy.learningStyle,
      studyHours: buddy.studyHours,
      interests: buddy.interests,
      compatibility: calculateCompatibility(currentUser, buddy),
    }))

    // Sort by compatibility
    buddiesWithCompatibility.sort((a, b) => b.compatibility - a.compatibility)

    return NextResponse.json({ buddies: buddiesWithCompatibility })
  } catch (error) {
    console.error('Error fetching potential buddies:', error)
    return NextResponse.json({ buddies: [] })
  }
}



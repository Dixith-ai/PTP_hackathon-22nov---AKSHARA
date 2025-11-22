import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user-id')?.value

    if (!userId) {
      return NextResponse.json({ badges: [] })
    }

    const badges = await prisma.badge.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
    })

    return NextResponse.json({ badges })
  } catch (error) {
    return NextResponse.json({ badges: [] })
  }
}



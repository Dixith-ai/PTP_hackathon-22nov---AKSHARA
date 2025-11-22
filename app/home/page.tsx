'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { DoodleStar, DoodleSparkle } from '@/components/Doodle'
import { useAuth } from '@/app/providers'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Flame, Target, BookOpen, Users } from 'lucide-react'
import toast from 'react-hot-toast'

interface Habit {
  id: string
  title: string
  description?: string
  type: string
}

interface Streak {
  id: string
  type: string
  count: number
}

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [streaks, setStreaks] = useState<Streak[]>([])
  const [currentMood, setCurrentMood] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchData()
    }
  }, [user, loading])

  const fetchData = async () => {
    try {
      const [habitsRes, streaksRes, moodRes] = await Promise.all([
        fetch('/api/habits').catch(() => null),
        fetch('/api/streaks').catch(() => null),
        fetch('/api/emotions/latest').catch(() => null),
      ])

      if (habitsRes && habitsRes.ok) {
        const habitsData = await habitsRes.json()
        setHabits(habitsData.habits || [])
      } else {
        // Use mock data
        const { mockHabits } = await import('@/lib/mockData')
        setHabits(mockHabits)
      }

      if (streaksRes && streaksRes.ok) {
        const streaksData = await streaksRes.json()
        setStreaks(streaksData.streaks || [])
      } else {
        // Use mock data
        const { mockStreaks } = await import('@/lib/mockData')
        setStreaks(mockStreaks)
      }

      if (moodRes && moodRes.ok) {
        const moodData = await moodRes.json()
        setCurrentMood(moodData.mood)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      // Fallback to mock data
      const { mockHabits, mockStreaks } = await import('@/lib/mockData')
      setHabits(mockHabits)
      setStreaks(mockStreaks)
    }
  }

  const handleHabitComplete = async (habitId: string) => {
    try {
      const res = await fetch('/api/habits/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId }),
      }).catch(() => null)

      if (res && res.ok) {
        toast.success('Tiny win unlocked! 🎉')
        fetchData()
      } else {
        // Mock success in frontend-only mode
        toast.success('Tiny win unlocked! 🎉 (Demo Mode)')
        fetchData()
      }
    } catch (error) {
      // Mock success in frontend-only mode
      toast.success('Tiny win unlocked! 🎉 (Demo Mode)')
      fetchData()
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <DoodleStar className="text-neon-pink w-16 h-16 mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </Layout>
    )
  }

  const mainStreak = streaks.find((s) => s.type === 'daily') || { count: 0 }

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            Hey {user?.name}! 👋
          </h1>
          <p className="text-gray-400 text-lg">
            What vibe are you studying with today?
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card glow neon="pink">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-neon-pink flex items-center gap-2">
                  <Flame className="w-8 h-8" />
                  {mainStreak.count} days
                </p>
              </div>
            </div>
          </Card>

          <Card glow neon="purple">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Active Habits</p>
                <p className="text-3xl font-bold text-neon-purple flex items-center gap-2">
                  <Target className="w-8 h-8" />
                  {habits.length}
                </p>
              </div>
            </div>
          </Card>

          <Card glow neon="blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Today's Mood</p>
                <p className="text-lg font-bold text-neon-blue capitalize">
                  {currentMood || 'Not set'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Emotion Check-in */}
        {!currentMood && (
          <Card className="mb-8 border-neon-cyan">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">How are you feeling?</h3>
                <p className="text-gray-400">Check in with your mood to get personalized suggestions</p>
              </div>
              <Link href="/emotion-check">
                <Button variant="neon">Check In</Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Habits Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-neon-pink" />
              Your Habits
            </h2>
            <Link href="/habits">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>

          {habits.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <DoodleStar className="text-neon-pink w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No habits yet</h3>
                <p className="text-gray-400 mb-4">Start building tiny daily wins!</p>
                <Link href="/habits">
                  <Button variant="primary">Create Your First Habit</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habits.map((habit) => (
                <Card key={habit.id} hover neon="pink">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{habit.title}</h3>
                      {habit.description && (
                        <p className="text-gray-400 text-sm">{habit.description}</p>
                      )}
                    </div>
                    <Badge variant="neon" size="sm">{habit.type}</Badge>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleHabitComplete(habit.id)}
                  >
                    Complete
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card hover neon="purple">
            <Link href="/courses" className="block">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-neon-purple/20 rounded-xl">
                  <BookOpen className="w-8 h-8 text-neon-purple" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Continue Learning</h3>
                  <p className="text-gray-400 text-sm">Pick up where you left off</p>
                </div>
              </div>
            </Link>
          </Card>

          <Card hover neon="blue">
            <Link href="/community" className="block">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-neon-blue/20 rounded-xl">
                  <Users className="w-8 h-8 text-neon-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Join Community</h3>
                  <p className="text-gray-400 text-sm">Share wins and get support</p>
                </div>
              </div>
            </Link>
          </Card>
        </div>
      </div>
    </Layout>
  )
}



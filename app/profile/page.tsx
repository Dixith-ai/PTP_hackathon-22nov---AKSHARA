'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { motion } from 'framer-motion'
import { User, Flame, Target, BookOpen, Award } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Stats {
  streak: number
  habits: number
  courses: number
  badges: number
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({ streak: 0, habits: 0, courses: 0, badges: 0 })
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: '',
    username: '',
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    if (user) {
      fetchStats()
      fetchProfile()
    }
  }, [user, loading])

  const fetchStats = async () => {
    try {
      const [streaksRes, habitsRes, coursesRes, badgesRes] = await Promise.all([
        fetch('/api/streaks').catch(() => ({ ok: false })),
        fetch('/api/habits').catch(() => ({ ok: false })),
        fetch('/api/courses/enrolled').catch(() => ({ ok: false })),
        fetch('/api/badges').catch(() => ({ ok: false })),
      ])

      let streak = 0
      let habits = 0
      let courses = 0
      let badges = 0

      if (streaksRes.ok) {
        const data = await streaksRes.json()
        streak = data.streaks?.[0]?.count || 0
      } else {
        const { mockStreaks } = await import('@/lib/mockData')
        streak = mockStreaks[0]?.count || 0
      }

      if (habitsRes.ok) {
        const data = await habitsRes.json()
        habits = data.habits?.length || 0
      } else {
        const { mockHabits } = await import('@/lib/mockData')
        habits = mockHabits.length
      }

      if (coursesRes.ok) {
        const data = await coursesRes.json()
        courses = data.courses?.length || 0
      } else {
        courses = 0 // No enrolled courses in demo
      }

      if (badgesRes.ok) {
        const data = await badgesRes.json()
        badges = data.badges?.length || 0
      } else {
        const { mockBadges } = await import('@/lib/mockData')
        badges = mockBadges.length
      }

      setStats({ streak, habits, courses, badges })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Fallback to mock data
      const { mockStreaks, mockHabits, mockBadges } = await import('@/lib/mockData')
      setStats({
        streak: mockStreaks[0]?.count || 0,
        habits: mockHabits.length,
        courses: 0,
        badges: mockBadges.length,
      })
    }
  }

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()
        setFormData({
          name: data.name || user?.name || '',
          bio: data.bio || '',
          username: data.username || '',
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success('Profile updated! 🎉')
        setEditing(false)
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  if (loading) return <Layout><div className="p-8">Loading...</div></Layout>

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
          <p className="text-gray-400 text-lg">Manage your account and view your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <Card glow neon="pink">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-neon-pink/20 rounded-xl">
                <Flame className="w-8 h-8 text-neon-pink" />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-neon-pink">{stats.streak} days</p>
              </div>
            </div>
          </Card>

          <Card glow neon="purple">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-neon-purple/20 rounded-xl">
                <Target className="w-8 h-8 text-neon-purple" />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Active Habits</p>
                <p className="text-3xl font-bold text-neon-purple">{stats.habits}</p>
              </div>
            </div>
          </Card>

          <Card glow neon="blue">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-neon-blue/20 rounded-xl">
                <BookOpen className="w-8 h-8 text-neon-blue" />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Enrolled Courses</p>
                <p className="text-3xl font-bold text-neon-blue">{stats.courses}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Info */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Profile Information</h2>
            {!editing ? (
              <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="your-username"
              />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Name</p>
                <p className="text-lg font-semibold">{formData.name || user?.name}</p>
              </div>
              {formData.username && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Username</p>
                  <p className="text-lg font-semibold">@{formData.username}</p>
                </div>
              )}
              {formData.bio && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Bio</p>
                  <p className="text-gray-300">{formData.bio}</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  )
}



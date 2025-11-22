'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { motion } from 'framer-motion'
import { Target, Plus, Flame, CheckCircle } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { DoodleStar } from '@/components/Doodle'

interface Habit {
  id: string
  title: string
  description?: string
  type: string
  difficulty?: string
  isActive: boolean
  completions?: { completedAt: Date }[]
}

export default function HabitsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [habits, setHabits] = useState<Habit[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    type: 'daily',
    difficulty: 'easy',
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    fetchHabits()
  }, [user, loading])

  const fetchHabits = async () => {
    try {
      const res = await fetch('/api/habits')
      if (res.ok) {
        const data = await res.json()
        setHabits(data.habits || [])
      }
    } catch (error) {
      console.error('Error fetching habits:', error)
    }
  }

  const handleCreate = async () => {
    if (!newHabit.title.trim()) {
      toast.error('Please enter a habit title')
      return
    }

    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHabit),
      })

      if (res.ok) {
        toast.success('Habit created! 🎉')
        setShowCreateModal(false)
        setNewHabit({ title: '', description: '', type: 'daily', difficulty: 'easy' })
        fetchHabits()
      } else {
        throw new Error('Failed to create habit')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  const handleComplete = async (habitId: string) => {
    try {
      const res = await fetch('/api/habits/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId }),
      })

      if (res.ok) {
        toast.success('Tiny win unlocked! 🎉')
        fetchHabits()
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  if (loading) return <Layout><div className="p-8">Loading...</div></Layout>

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Habits</h1>
            <p className="text-gray-400 text-lg">Build consistency with tiny daily wins</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Habit
          </Button>
        </div>

        {habits.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <DoodleStar className="text-neon-pink w-20 h-20 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No habits yet</h3>
              <p className="text-gray-400 mb-6">Start building tiny daily wins!</p>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Create Your First Habit
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit, idx) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card hover neon="pink" className="h-full flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{habit.title}</h3>
                        {habit.description && (
                          <p className="text-gray-400 text-sm mb-3">{habit.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <Badge variant="neon" size="sm">{habit.type}</Badge>
                      {habit.difficulty && (
                        <Badge variant="warm" size="sm">{habit.difficulty}</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleComplete(habit.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Habit"
      >
        <div className="space-y-4">
          <Input
            label="Habit Title"
            placeholder="e.g., Read for 15 minutes"
            value={newHabit.title}
            onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
          />
          <Input
            label="Description (optional)"
            placeholder="Add a note about this habit"
            value={newHabit.description}
            onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <select
              value={newHabit.type}
              onChange={(e) => setNewHabit({ ...newHabit, type: e.target.value })}
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
            <select
              value={newHabit.difficulty}
              onChange={(e) => setNewHabit({ ...newHabit, difficulty: e.target.value })}
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="flex gap-4">
            <Button variant="primary" className="flex-1" onClick={handleCreate}>
              Create Habit
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}



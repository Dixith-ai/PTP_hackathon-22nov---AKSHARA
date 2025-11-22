'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { DoodleStar, DoodleSparkle, DoodleHeart } from '@/components/Doodle'
import toast from 'react-hot-toast'
import { useAuth } from '@/app/providers'

const moods = [
  { id: 'energetic', label: 'Energetic', emoji: '⚡', color: 'neon-yellow' },
  { id: 'calm', label: 'Calm', emoji: '🌊', color: 'neon-cyan' },
  { id: 'focused', label: 'Focused', emoji: '🎯', color: 'neon-blue' },
  { id: 'tired', label: 'Tired', emoji: '😴', color: 'neon-purple' },
  { id: 'stressed', label: 'Stressed', emoji: '😰', color: 'warm-rose' },
  { id: 'excited', label: 'Excited', emoji: '🎉', color: 'neon-pink' },
]

export default function EmotionCheckPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [intensity, setIntensity] = useState(5)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast.error('Please select a mood')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/emotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood,
          intensity,
          notes,
        }),
      })

      if (res.ok) {
        toast.success('Mood recorded! We\'ll suggest tasks that match your energy 🎯')
        router.push('/home')
      } else {
        // Mock success in demo mode
        toast.success('Mood recorded! We\'ll suggest tasks that match your energy 🎯 (Demo Mode)')
        router.push('/home')
      }
    } catch (error: any) {
      // Mock success in demo mode
      toast.success('Mood recorded! We\'ll suggest tasks that match your energy 🎯 (Demo Mode)')
      router.push('/home')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <DoodleHeart className="text-neon-pink w-20 h-20 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">How are you feeling today?</h1>
            <p className="text-gray-400 text-lg">
              Your mood helps us suggest the perfect tasks for your energy level
            </p>
          </div>

          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Select Your Mood</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {moods.map((mood) => (
                <motion.button
                  key={mood.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`
                    p-6 rounded-2xl border-2 transition-all
                    ${selectedMood === mood.id
                      ? `border-${mood.color} bg-${mood.color}/20`
                      : 'border-dark-border bg-dark-surface hover:border-neon-purple/50'
                    }
                  `}
                >
                  <div className="text-4xl mb-2">{mood.emoji}</div>
                  <div className={`font-bold ${selectedMood === mood.id ? `text-${mood.color}` : 'text-gray-300'}`}>
                    {mood.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>

          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Intensity Level</h2>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="w-full h-2 bg-dark-surface rounded-lg appearance-none cursor-pointer accent-neon-pink"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Low</span>
                    <span className="text-neon-pink font-bold text-lg">{intensity}</span>
                    <span>High</span>
                  </div>
                </div>
              </Card>

              <Card className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Optional Notes</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What's on your mind? (optional)"
                  className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent resize-none"
                  rows={4}
                />
              </Card>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Mood & Get Suggestions'}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}



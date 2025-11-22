'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { DoodleSparkle, DoodleStar } from '@/components/Doodle'
import toast from 'react-hot-toast'
import { useAuth } from '@/app/providers'

const learningStyles = ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing']
const moods = ['energetic', 'calm', 'focused', 'tired', 'stressed', 'excited']

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    learningStyle: '',
    studyHours: '',
    goals: '',
    interests: '',
    initialMood: '',
    firstHabit: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          studyHours: parseInt(formData.studyHours),
        }),
      })

      if (!res.ok) throw new Error('Failed to save onboarding data')

      toast.success('Welcome to AKSHARA! 🎉')
      router.push('/home')
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Step {step} of 5</span>
            <span className="text-sm text-gray-400">{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-pink to-neon-purple"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-8"
          >
            {step === 1 && (
              <div>
                <div className="text-center mb-8">
                  <DoodleStar className="text-neon-pink w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">How do you learn best?</h2>
                  <p className="text-gray-400">This helps us personalize your experience</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {learningStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => setFormData({ ...formData, learningStyle: style })}
                      className={`
                        p-4 rounded-xl border transition-all
                        ${formData.learningStyle === style
                          ? 'border-neon-pink bg-neon-pink/20 text-neon-pink'
                          : 'border-dark-border bg-dark-surface text-gray-300 hover:border-neon-purple/50'
                        }
                      `}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="text-center mb-8">
                  <DoodleSparkle className="text-neon-purple w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">How many hours do you study per day?</h2>
                  <p className="text-gray-400">We'll help you stay consistent</p>
                </div>
                <Input
                  type="number"
                  label="Study Hours"
                  placeholder="e.g., 2"
                  value={formData.studyHours}
                  onChange={(e) => setFormData({ ...formData, studyHours: e.target.value })}
                  min="1"
                  max="12"
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="text-center mb-8">
                  <DoodleStar className="text-neon-blue w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">What are your learning goals?</h2>
                  <p className="text-gray-400">Tell us what you want to achieve</p>
                </div>
                <Input
                  type="text"
                  label="Goals"
                  placeholder="e.g., Master React, Learn Spanish, Pass exams"
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                />
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="text-center mb-8">
                  <DoodleSparkle className="text-neon-cyan w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">What's your vibe today?</h2>
                  <p className="text-gray-400">We'll suggest tasks that match your energy</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {moods.map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setFormData({ ...formData, initialMood: mood })}
                      className={`
                        p-4 rounded-xl border capitalize transition-all
                        ${formData.initialMood === mood
                          ? 'border-neon-pink bg-neon-pink/20 text-neon-pink'
                          : 'border-dark-border bg-dark-surface text-gray-300 hover:border-neon-purple/50'
                        }
                      `}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <div className="text-center mb-8">
                  <DoodleStar className="text-neon-green w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">Create your first habit</h2>
                  <p className="text-gray-400">Start with something small and achievable</p>
                </div>
                <Input
                  type="text"
                  label="Habit"
                  placeholder="e.g., Read for 15 minutes, Practice coding, Review notes"
                  value={formData.firstHabit}
                  onChange={(e) => setFormData({ ...formData, firstHabit: e.target.value })}
                />
              </div>
            )}

            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button variant="secondary" onClick={prevStep} className="flex-1">
                  Back
                </Button>
              )}
              <Button
                variant="primary"
                onClick={nextStep}
                className="flex-1"
                disabled={loading || (step === 1 && !formData.learningStyle) || (step === 2 && !formData.studyHours) || (step === 3 && !formData.goals) || (step === 4 && !formData.initialMood) || (step === 5 && !formData.firstHabit)}
              >
                {loading ? 'Saving...' : step === 5 ? 'Complete Setup' : 'Next'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}



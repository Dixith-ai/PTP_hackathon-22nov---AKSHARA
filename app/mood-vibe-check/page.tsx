'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { motion, AnimatePresence } from 'framer-motion'
import { DoodleStar, DoodleSparkle, DoodleHeart } from '@/components/Doodle'
import toast from 'react-hot-toast'
import { useAuth } from '@/app/providers'
import { 
  Brain, 
  Zap, 
  BookOpen, 
  Target, 
  Palette, 
  FileText, 
  Coffee,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react'

// Mood options
const moods = [
  { id: 'calm', label: 'Calm', emoji: '🌊', icon: Brain, color: 'cyan', description: 'Peaceful and relaxed' },
  { id: 'tired', label: 'Tired', emoji: '😴', icon: Coffee, color: 'purple', description: 'Low energy, need rest' },
  { id: 'stressed', label: 'Stressed', emoji: '😰', icon: Zap, color: 'pink', description: 'Feeling overwhelmed' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡', icon: Zap, color: 'yellow', description: 'Full of energy!' },
  { id: 'distracted', label: 'Distracted', emoji: '🤯', icon: Sparkles, color: 'blue', description: 'Hard to focus' },
  { id: 'curious', label: 'Curious', emoji: '🤔', icon: Brain, color: 'green', description: 'Ready to explore' },
]

// Vibe options
const vibes = [
  { 
    id: 'deep-focus', 
    label: 'Deep Focus', 
    icon: Target, 
    color: 'blue',
    description: 'Intensive learning sessions',
    intensity: 'high'
  },
  { 
    id: 'quick-wins', 
    label: 'Quick Wins', 
    icon: CheckCircle2, 
    color: 'green',
    description: 'Short, achievable tasks',
    intensity: 'low'
  },
  { 
    id: 'creative-practice', 
    label: 'Creative Practice', 
    icon: Palette, 
    color: 'purple',
    description: 'Hands-on projects',
    intensity: 'medium'
  },
  { 
    id: 'review-tests', 
    label: 'Review & Tests', 
    icon: FileText, 
    color: 'pink',
    description: 'Practice and assessment',
    intensity: 'high'
  },
  { 
    id: 'light-read', 
    label: 'Light Read', 
    icon: BookOpen, 
    color: 'cyan',
    description: 'Casual learning',
    intensity: 'low'
  },
]

// Time options
const timeOptions = [
  { id: 15, label: '15m', minutes: 15 },
  { id: 30, label: '30m', minutes: 30 },
  { id: 60, label: '1h', minutes: 60 },
  { id: 90, label: '1.5h', minutes: 90 },
  { id: 180, label: '3h', minutes: 180 },
]

// Subject options
const subjects = [
  'Web Development',
  'React',
  'JavaScript',
  'TypeScript',
  'Python',
  'Data Structures',
  'Algorithms',
  'UI/UX Design',
  'Machine Learning',
  'Database',
  'System Design',
  'DevOps',
]

interface StudyPlan {
  summary: string
  lessons: number
  intensity: string
  practiceCount: number
  breaks: number
  schedule: Array<{
    time: string
    activity: string
    duration: string
    type: string
  }>
}

export default function MoodVibeCheckPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<number | null>(null)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [plan, setPlan] = useState<StudyPlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    )
  }

  const generatePlan = () => {
    if (!selectedMood || !selectedVibe || !selectedTime) {
      toast.error('Please select mood, vibe, and time to generate your plan')
      return
    }

    setIsGenerating(true)

    // Simulate generation delay
    setTimeout(() => {
      const mood = moods.find(m => m.id === selectedMood)!
      const vibe = vibes.find(v => v.id === selectedVibe)!
      const totalMinutes = selectedTime

      // Calculate plan based on selections
      let lessons = 0
      let practiceCount = 0
      let breaks = 0
      let intensity = ''

      // Mood-based adjustments
      if (selectedMood === 'energetic') {
        lessons = Math.ceil(totalMinutes / 25)
        practiceCount = Math.ceil(lessons * 0.6)
        breaks = Math.ceil(totalMinutes / 60)
        intensity = 'High'
      } else if (selectedMood === 'tired') {
        lessons = Math.ceil(totalMinutes / 40)
        practiceCount = Math.ceil(lessons * 0.3)
        breaks = Math.ceil(totalMinutes / 30)
        intensity = 'Low'
      } else if (selectedMood === 'stressed') {
        lessons = Math.ceil(totalMinutes / 35)
        practiceCount = Math.ceil(lessons * 0.4)
        breaks = Math.ceil(totalMinutes / 25)
        intensity = 'Medium-Low'
      } else if (selectedMood === 'calm') {
        lessons = Math.ceil(totalMinutes / 30)
        practiceCount = Math.ceil(lessons * 0.5)
        breaks = Math.ceil(totalMinutes / 45)
        intensity = 'Medium'
      } else if (selectedMood === 'distracted') {
        lessons = Math.ceil(totalMinutes / 20)
        practiceCount = Math.ceil(lessons * 0.4)
        breaks = Math.ceil(totalMinutes / 20)
        intensity = 'Low-Medium'
      } else { // curious
        lessons = Math.ceil(totalMinutes / 30)
        practiceCount = Math.ceil(lessons * 0.7)
        breaks = Math.ceil(totalMinutes / 50)
        intensity = 'Medium-High'
      }

      // Vibe-based adjustments
      if (selectedVibe === 'deep-focus') {
        lessons = Math.max(lessons, 3)
        intensity = 'High'
        practiceCount = Math.ceil(lessons * 0.4)
      } else if (selectedVibe === 'quick-wins') {
        lessons = Math.min(lessons, Math.ceil(totalMinutes / 15))
        intensity = 'Low'
        practiceCount = Math.ceil(lessons * 0.8)
      } else if (selectedVibe === 'review-tests') {
        practiceCount = Math.ceil(lessons * 1.2)
        intensity = 'High'
      } else if (selectedVibe === 'light-read') {
        lessons = Math.ceil(lessons * 0.7)
        practiceCount = Math.ceil(lessons * 0.2)
        intensity = 'Low'
      }

      // Generate schedule
      const schedule: StudyPlan['schedule'] = []
      let currentTime = 0
      const lessonDuration = Math.floor(totalMinutes / (lessons + breaks))

      for (let i = 0; i < lessons + breaks; i++) {
        if (i % 2 === 0 && i < lessons * 2) {
          // Lesson block
          const lessonNum = Math.floor(i / 2) + 1
          schedule.push({
            time: `${Math.floor(currentTime / 60)}:${String(currentTime % 60).padStart(2, '0')}`,
            activity: `Lesson ${lessonNum}: ${selectedSubjects.length > 0 ? selectedSubjects[0] : 'Learning'}`,
            duration: `${lessonDuration}m`,
            type: 'lesson',
          })
          currentTime += lessonDuration
        } else {
          // Break block
          const breakDuration = Math.min(10, Math.floor(totalMinutes / (breaks * 2)))
          schedule.push({
            time: `${Math.floor(currentTime / 60)}:${String(currentTime % 60).padStart(2, '0')}`,
            activity: 'Break ☕',
            duration: `${breakDuration}m`,
            type: 'break',
          })
          currentTime += breakDuration
        }
      }

      // Generate warm summary
      const summaries = [
        `Perfect! Based on your ${mood.label.toLowerCase()} mood and ${vibe.label.toLowerCase()} vibe, we've crafted a ${intensity.toLowerCase()} intensity plan that fits your ${totalMinutes}-minute window.`,
        `Great choice! Your ${mood.label.toLowerCase()} energy paired with ${vibe.label.toLowerCase()} is ideal for ${selectedTime >= 60 ? 'extended' : 'focused'} learning. Let's make the most of your time!`,
        `Awesome! We've designed a ${intensity.toLowerCase()} intensity session matching your ${mood.label.toLowerCase()} state and ${vibe.label.toLowerCase()} goals. Ready to dive in?`,
      ]

      const generatedPlan: StudyPlan = {
        summary: summaries[Math.floor(Math.random() * summaries.length)],
        lessons,
        intensity,
        practiceCount,
        breaks,
        schedule: schedule.slice(0, Math.min(8, schedule.length)), // Limit to 8 items
      }

      setPlan(generatedPlan)
      setIsGenerating(false)
      toast.success('Your personalized study plan is ready! 🎉')
    }, 1500)
  }

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-4"
            >
              <DoodleStar className="text-neon-pink w-16 h-16 mx-auto" />
            </motion.div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Mood & Vibe Check-In
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Tell us how you're feeling and what you want to achieve today. We'll create a personalized study plan just for you! ✨
            </p>
          </div>

          {/* Step 1: Mood Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card glow neon="pink" className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-neon-pink/20 rounded-lg">
                  <DoodleHeart className="text-neon-pink w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">How are you feeling right now?</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {moods.map((mood, idx) => {
                  const Icon = mood.icon
                  return (
                    <motion.button
                      key={mood.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedMood(mood.id)}
                      className={`p-6 rounded-2xl border-2 transition-all text-center ${
                        selectedMood === mood.id
                          ? mood.color === 'cyan' ? 'border-neon-cyan bg-neon-cyan/20 shadow-lg shadow-neon-cyan/30'
                          : mood.color === 'purple' ? 'border-neon-purple bg-neon-purple/20 shadow-lg shadow-neon-purple/30'
                          : mood.color === 'pink' ? 'border-neon-pink bg-neon-pink/20 shadow-lg shadow-neon-pink/30'
                          : mood.color === 'yellow' ? 'border-neon-yellow bg-neon-yellow/20 shadow-lg shadow-neon-yellow/30'
                          : mood.color === 'blue' ? 'border-neon-blue bg-neon-blue/20 shadow-lg shadow-neon-blue/30'
                          : 'border-neon-green bg-neon-green/20 shadow-lg shadow-neon-green/30'
                          : 'border-dark-border bg-dark-surface hover:border-neon-purple/50'
                      }`}
                    >
                      <div className="text-5xl mb-3">{mood.emoji}</div>
                      <div className={`font-bold text-lg mb-1 ${
                        selectedMood === mood.id 
                          ? mood.color === 'cyan' ? 'text-neon-cyan'
                          : mood.color === 'purple' ? 'text-neon-purple'
                          : mood.color === 'pink' ? 'text-neon-pink'
                          : mood.color === 'yellow' ? 'text-neon-yellow'
                          : mood.color === 'blue' ? 'text-neon-blue'
                          : 'text-neon-green'
                          : 'text-gray-300'
                      }`}>
                        {mood.label}
                      </div>
                      <div className="text-xs text-gray-500">{mood.description}</div>
                    </motion.button>
                  )
                })}
              </div>
            </Card>
          </motion.div>

          {/* Step 2: Vibe Selection */}
          <AnimatePresence>
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2 }}
              >
                <Card glow neon="purple" className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-neon-purple/20 rounded-lg">
                      <Sparkles className="text-neon-purple w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">What study vibe do you want today?</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {vibes.map((vibe, idx) => {
                      const Icon = vibe.icon
                      return (
                        <motion.button
                          key={vibe.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.05, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedVibe(vibe.id)}
                          className={`p-6 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${
                            selectedVibe === vibe.id
                              ? vibe.color === 'blue' ? 'border-neon-blue bg-neon-blue/20 shadow-lg shadow-neon-blue/30'
                              : vibe.color === 'green' ? 'border-neon-green bg-neon-green/20 shadow-lg shadow-neon-green/30'
                              : vibe.color === 'purple' ? 'border-neon-purple bg-neon-purple/20 shadow-lg shadow-neon-purple/30'
                              : vibe.color === 'pink' ? 'border-neon-pink bg-neon-pink/20 shadow-lg shadow-neon-pink/30'
                              : 'border-neon-cyan bg-neon-cyan/20 shadow-lg shadow-neon-cyan/30'
                              : 'border-dark-border bg-dark-surface hover:border-neon-purple/50'
                          }`}
                        >
                          {selectedVibe === vibe.id && (
                            <motion.div
                              className={`absolute inset-0 ${
                                vibe.color === 'blue' ? 'bg-neon-blue/10'
                                : vibe.color === 'green' ? 'bg-neon-green/10'
                                : vibe.color === 'purple' ? 'bg-neon-purple/10'
                                : vibe.color === 'pink' ? 'bg-neon-pink/10'
                                : 'bg-neon-cyan/10'
                              }`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 0.5, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                          <div className="relative z-10">
                            <Icon className={`w-8 h-8 mb-3 ${
                              selectedVibe === vibe.id 
                                ? vibe.color === 'blue' ? 'text-neon-blue'
                                : vibe.color === 'green' ? 'text-neon-green'
                                : vibe.color === 'purple' ? 'text-neon-purple'
                                : vibe.color === 'pink' ? 'text-neon-pink'
                                : 'text-neon-cyan'
                                : 'text-gray-400'
                            }`} />
                            <div className={`font-bold text-lg mb-1 ${
                              selectedVibe === vibe.id 
                                ? vibe.color === 'blue' ? 'text-neon-blue'
                                : vibe.color === 'green' ? 'text-neon-green'
                                : vibe.color === 'purple' ? 'text-neon-purple'
                                : vibe.color === 'pink' ? 'text-neon-pink'
                                : 'text-neon-cyan'
                                : 'text-gray-300'
                            }`}>
                              {vibe.label}
                            </div>
                            <div className="text-sm text-gray-400">{vibe.description}</div>
                            <Badge 
                              variant="neon" 
                              size="sm" 
                              className="mt-2"
                            >
                              {vibe.intensity} intensity
                            </Badge>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3: Time Selection */}
          <AnimatePresence>
            {selectedVibe && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
              >
                <Card glow neon="blue" className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-neon-blue/20 rounded-lg">
                      <Clock className="text-neon-blue w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">How much time do you have?</h2>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {timeOptions.map((time, idx) => (
                      <motion.button
                        key={time.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedTime(time.minutes)}
                        className={`
                          px-8 py-4 rounded-xl border-2 font-bold text-lg transition-all
                          ${selectedTime === time.minutes
                            ? 'border-neon-blue bg-neon-blue/20 text-neon-blue shadow-lg shadow-neon-blue/30'
                            : 'border-dark-border bg-dark-surface text-gray-300 hover:border-neon-blue/50'
                          }
                        `}
                      >
                        {time.label}
                      </motion.button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 4: Subjects (Optional) */}
          <AnimatePresence>
            {selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-neon-cyan/20 rounded-lg">
                      <BookOpen className="text-neon-cyan w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Subjects (Optional)</h2>
                      <p className="text-sm text-gray-400">Select topics you want to focus on</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {subjects.map((subject, idx) => (
                      <motion.button
                        key={subject}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleSubject(subject)}
                        className={`
                          px-4 py-2 rounded-full border-2 text-sm font-medium transition-all
                          ${selectedSubjects.includes(subject)
                            ? 'border-neon-cyan bg-neon-cyan/20 text-neon-cyan'
                            : 'border-dark-border bg-dark-surface text-gray-400 hover:border-neon-cyan/50'
                          }
                        `}
                      >
                        {subject}
                      </motion.button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate Button */}
          <AnimatePresence>
            {selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full text-xl py-6"
                  onClick={generatePlan}
                  disabled={isGenerating || !selectedMood || !selectedVibe || !selectedTime}
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <DoodleSparkle className="w-6 h-6" />
                      </motion.div>
                      Generating Your Plan...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <Sparkles className="w-6 h-6" />
                      Generate Today's Plan
                    </span>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generated Plan */}
          <AnimatePresence>
            {plan && (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <Card glow neon="pink" className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <DoodleStar className="text-neon-pink w-8 h-8" />
                    </motion.div>
                    <h2 className="text-3xl font-bold">Your Study Plan for Today</h2>
                  </div>

                  {/* Warm Summary */}
                  <div className="mb-8 p-6 bg-neon-pink/10 rounded-xl border border-neon-pink/30">
                    <p className="text-lg text-gray-200 leading-relaxed">{plan.summary}</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <Card className="text-center">
                      <div className="text-3xl font-bold text-neon-pink mb-2">{plan.lessons}</div>
                      <div className="text-sm text-gray-400">Lessons</div>
                    </Card>
                    <Card className="text-center">
                      <div className="text-2xl font-bold text-neon-purple mb-2">{plan.intensity}</div>
                      <div className="text-sm text-gray-400">Intensity</div>
                    </Card>
                    <Card className="text-center">
                      <div className="text-3xl font-bold text-neon-blue mb-2">{plan.practiceCount}</div>
                      <div className="text-sm text-gray-400">Practice Tasks</div>
                    </Card>
                    <Card className="text-center">
                      <div className="text-3xl font-bold text-neon-cyan mb-2">{plan.breaks}</div>
                      <div className="text-sm text-gray-400">Breaks</div>
                    </Card>
                    <Card className="text-center">
                      <div className="text-2xl font-bold text-neon-green mb-2">
                        {selectedTime}m
                      </div>
                      <div className="text-sm text-gray-400">Total Time</div>
                    </Card>
                  </div>

                  {/* Schedule */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-neon-cyan" />
                      Today's Schedule
                    </h3>
                    <div className="space-y-3">
                      {plan.schedule.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`
                            p-4 rounded-xl border-2 flex items-center justify-between
                            ${item.type === 'lesson'
                              ? 'border-neon-blue/50 bg-neon-blue/10'
                              : 'border-neon-purple/50 bg-neon-purple/10'
                            }
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <div className="font-mono font-bold text-neon-cyan w-16">
                              {item.time}
                            </div>
                            <div>
                              <div className="font-medium text-gray-200">{item.activity}</div>
                              {item.type === 'lesson' && selectedSubjects.length > 0 && (
                                <div className="text-sm text-gray-400">
                                  {selectedSubjects.slice(0, 2).join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge variant="neon" size="sm">
                            {item.duration}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-8">
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => {
                        toast.success('Plan saved! Check your home page 🎯')
                        router.push('/home')
                      }}
                    >
                      Start Learning
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setPlan(null)
                        setSelectedMood(null)
                        setSelectedVibe(null)
                        setSelectedTime(null)
                        setSelectedSubjects([])
                      }}
                    >
                      Create New Plan
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  )
}


'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { 
  Heart, 
  X, 
  Sparkles, 
  Users, 
  RefreshCw,
  MessageCircle,
  Clock,
  BookOpen,
  Zap
} from 'lucide-react'
import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { DoodleStar, DoodleHeart, DoodleSparkle } from '@/components/Doodle'

interface Buddy {
  id: string
  name: string
  avatar: string
  vibe: string
  mood: string[]
  compatibility: number
  sharedSubjects: string[]
  studyFrequency: string
  trait: string
  bio?: string
}

interface Match {
  id: string
  name: string
  avatar: string
  vibe: string
  moodCompatibility: string[]
  sharedSubjects: string[]
  encouragementMessage: string
  matchedAt: Date
}

// Mock buddy data
const mockBuddies: Buddy[] = [
  {
    id: '1',
    name: 'Alex',
    avatar: '👨‍💻',
    vibe: 'Night Owl • Deep Focus Mode',
    mood: ['energetic', 'focused'],
    compatibility: 92,
    sharedSubjects: ['React', 'TypeScript', 'Web Development'],
    studyFrequency: 'Daily, 8pm-12am',
    trait: 'Always sends "you got this" messages',
    bio: 'Love building side projects and sharing code snippets!',
  },
  {
    id: '2',
    name: 'Sam',
    avatar: '👩‍💻',
    vibe: 'Early Bird • Quick Wins',
    mood: ['calm', 'curious'],
    compatibility: 87,
    sharedSubjects: ['JavaScript', 'UI/UX Design'],
    studyFrequency: 'Daily, 6am-9am',
    trait: 'Sends cute study reminders with emojis',
    bio: 'Morning person who loves coffee and clean code ☕',
  },
  {
    id: '3',
    name: 'Jordan',
    avatar: '🧑‍💻',
    vibe: 'Flexible • Creative Practice',
    mood: ['curious', 'energetic'],
    compatibility: 85,
    sharedSubjects: ['Python', 'Data Structures', 'Algorithms'],
    studyFrequency: 'Flexible schedule',
    trait: 'Shares interesting coding challenges',
    bio: 'Always exploring new tech and happy to pair program!',
  },
  {
    id: '4',
    name: 'Taylor',
    avatar: '👨‍🎓',
    vibe: 'Balanced • Review & Tests',
    mood: ['calm', 'focused'],
    compatibility: 90,
    sharedSubjects: ['System Design', 'DevOps'],
    studyFrequency: 'Weekdays, 2pm-6pm',
    trait: 'Great at explaining complex concepts simply',
    bio: 'Love teaching and learning together!',
  },
  {
    id: '5',
    name: 'Riley',
    avatar: '👩‍🎓',
    vibe: 'Light Read • Casual Learning',
    mood: ['calm', 'curious'],
    compatibility: 78,
    sharedSubjects: ['Machine Learning', 'Database'],
    studyFrequency: 'Weekends',
    trait: 'Sends motivational quotes every Monday',
    bio: 'Weekend warrior who loves learning at a relaxed pace',
  },
]

export default function StudyBuddyPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [buddies, setBuddies] = useState<Buddy[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matches, setMatches] = useState<Match[]>([])
  const [showMatchSuccess, setShowMatchSuccess] = useState(false)
  const [matchedBuddy, setMatchedBuddy] = useState<Match | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    // Load mock buddies
    setBuddies([...mockBuddies])
  }, [user, loading])

  const currentBuddy = buddies[currentIndex]

  const handleSwipe = (direction: 'left' | 'right', info?: PanInfo) => {
    if (direction === 'right') {
      handleMatch()
    } else {
      handleSkip()
    }
  }

  const handleMatch = () => {
    if (!currentBuddy) return

    const newMatch: Match = {
      id: currentBuddy.id,
      name: currentBuddy.name,
      avatar: currentBuddy.avatar,
      vibe: currentBuddy.vibe,
      moodCompatibility: currentBuddy.mood,
      sharedSubjects: currentBuddy.sharedSubjects,
      encouragementMessage: `Hey! ${currentBuddy.trait} Let's crush our goals together! 🚀`,
      matchedAt: new Date(),
    }

    setMatches([newMatch, ...matches])
    setMatchedBuddy(newMatch)
    setShowMatchSuccess(true)
    toast.success('New study pal unlocked! 🎉')

    // Move to next buddy
    setTimeout(() => {
      if (currentIndex < buddies.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        setBuddies([])
      }
      setShowMatchSuccess(false)
    }, 2000)
  }

  const handleSkip = () => {
    if (currentIndex < buddies.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setBuddies([])
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setBuddies([...mockBuddies])
      setCurrentIndex(0)
      setIsRefreshing(false)
      toast.success('Fresh suggestions loaded! ✨')
    }, 1000)
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <DoodleStar className="text-neon-pink w-16 h-16 animate-spin" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Intro Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <DoodleHeart className="text-neon-pink w-16 h-16 mx-auto" />
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Let's find your study vibe twin ✨
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Swipe through suggested buddies and pick someone who matches your energy today.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Card Area */}
          <div className="lg:col-span-3">
            {currentBuddy ? (
              <BuddyCard
                buddy={currentBuddy}
                onSwipe={handleSwipe}
                onMatch={handleMatch}
                onSkip={handleSkip}
              />
            ) : (
              <EmptyState onRefresh={handleRefresh} isRefreshing={isRefreshing} />
            )}

            {/* Match Success Card */}
            <AnimatePresence>
              {showMatchSuccess && matchedBuddy && (
                <MatchSuccessCard match={matchedBuddy} />
              )}
            </AnimatePresence>
          </div>

          {/* Matches List Sidebar */}
          <div className="lg:col-span-1">
            <MatchesList matches={matches} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

// Buddy Card Component with Swipe
function BuddyCard({
  buddy,
  onSwipe,
  onMatch,
  onSkip,
}: {
  buddy: Buddy
  onSwipe: (direction: 'left' | 'right', info?: PanInfo) => void
  onMatch: () => void
  onSkip: () => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 300], [-15, 15])
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0, 1, 1, 1, 0])

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe(info.offset.x > 0 ? 'right' : 'left', info)
    }
  }

  return (
    <div className="relative h-[600px] mb-6">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        style={{ x, rotate, opacity }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      >
        <Card glow neon="pink" className="h-full flex flex-col">
          {/* Avatar with Doodle Frame */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon-pink via-neon-purple to-neon-cyan flex items-center justify-center text-6xl relative z-10 border-4 border-neon-pink/50">
                {buddy.avatar}
              </div>
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-neon-pink/30"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.div>
          </div>

          {/* Name & Vibe */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">{buddy.name}</h2>
            <p className="text-neon-cyan text-lg font-medium">{buddy.vibe}</p>
          </div>

          {/* Compatibility Score */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-dark-border"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - buddy.compatibility / 100)}`}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - buddy.compatibility / 100) }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff6b9d" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-neon-pink">{buddy.compatibility}%</div>
                  <div className="text-sm text-gray-400">Match</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mood Match Tags */}
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2 text-center">Mood Match</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {buddy.mood.map((mood) => (
                <Badge key={mood} variant="neon" size="sm">
                  {mood}
                </Badge>
              ))}
            </div>
          </div>

          {/* Shared Subjects */}
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2 text-center flex items-center justify-center gap-1">
              <BookOpen className="w-4 h-4" />
              Shared Subjects
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {buddy.sharedSubjects.map((subject) => (
                <Badge key={subject} variant="neon" size="sm">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>

          {/* Study Frequency */}
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-400 mb-1 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4" />
              Study Frequency
            </p>
            <p className="text-gray-200 font-medium">{buddy.studyFrequency}</p>
          </div>

          {/* Friendly Trait */}
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-300 italic">"{buddy.trait}"</p>
          </div>

          {/* Controls */}
          <div className="flex gap-4 mt-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSkip}
              className="flex-1 px-6 py-4 rounded-xl border-2 border-neon-purple/50 bg-dark-surface text-gray-300 hover:border-neon-purple hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              <span className="font-medium">Skip</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMatch}
              className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple text-white font-medium hover:shadow-lg hover:shadow-neon-pink/50 transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              <span>Match</span>
            </motion.button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

// Match Success Card
function MatchSuccessCard({ match }: { match: Match }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      className="absolute inset-0 z-50 flex items-center justify-center"
    >
      <Card glow neon="pink" className="text-center p-8 max-w-md">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="text-6xl mb-4"
        >
          {match.avatar}
        </motion.div>
        <DoodleSparkle className="text-neon-yellow w-12 h-12 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-neon-pink mb-2">New study pal unlocked!</h3>
        <p className="text-xl font-semibold mb-4">{match.name}</p>
        <p className="text-gray-300 mb-4">{match.encouragementMessage}</p>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {match.sharedSubjects.slice(0, 3).map((subject) => (
            <Badge key={subject} variant="neon" size="sm">
              {subject}
            </Badge>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

// Matches List
function MatchesList({ matches }: { matches: Match[] }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-neon-purple" />
        <h3 className="text-xl font-bold">Your Matches</h3>
      </div>
      {matches.length === 0 ? (
        <div className="text-center py-8">
          <DoodleHeart className="text-gray-400 w-12 h-12 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No matches yet</p>
          <p className="text-xs text-gray-500 mt-1">Start swiping to find your study buddy!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-dark-surface hover:bg-dark-card transition-all cursor-pointer border border-dark-border hover:border-neon-purple/50"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center text-2xl">
                  {match.avatar}
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-neon-pink"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{match.name}</p>
                <p className="text-xs text-gray-400 truncate">{match.vibe}</p>
              </div>
              <MessageCircle className="w-4 h-4 text-gray-400" />
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  )
}

// Empty State
function EmptyState({ onRefresh, isRefreshing }: { onRefresh: () => void; isRefreshing: boolean }) {
  return (
    <Card className="text-center py-16">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="text-8xl mb-6"
      >
        🔍
      </motion.div>
      <h3 className="text-2xl font-bold mb-2">No matches right now…</h3>
      <p className="text-gray-400 mb-6">recharging the vibe radar!</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRefresh}
        disabled={isRefreshing}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple text-white font-medium hover:shadow-lg hover:shadow-neon-pink/50 transition-all flex items-center gap-2 mx-auto"
      >
        <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span>Refresh suggestions</span>
      </motion.button>
    </Card>
  )
}

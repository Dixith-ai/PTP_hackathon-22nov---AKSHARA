'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { motion } from 'framer-motion'
import { Users, Heart, X, MessageCircle, Sparkles } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { calculateCompatibility } from '@/lib/utils'

interface PotentialBuddy {
  id: string
  name: string
  username?: string
  bio?: string
  learningStyle?: string
  studyHours?: number
  interests?: string
  compatibility: number
}

export default function StudyBuddyPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [buddies, setBuddies] = useState<PotentialBuddy[]>([])
  const [currentBuddy, setCurrentBuddy] = useState<PotentialBuddy | null>(null)
  const [acceptedBuddies, setAcceptedBuddies] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    fetchPotentialBuddies()
    fetchAcceptedBuddies()
  }, [user, loading])

  const fetchPotentialBuddies = async () => {
    try {
      const res = await fetch('/api/study-buddies/potential')
      if (res.ok) {
        const data = await res.json()
        setBuddies(data.buddies || [])
        if (data.buddies && data.buddies.length > 0) {
          setCurrentBuddy(data.buddies[0])
        }
      }
    } catch (error) {
      console.error('Error fetching potential buddies:', error)
    }
  }

  const fetchAcceptedBuddies = async () => {
    try {
      const res = await fetch('/api/study-buddies/accepted')
      if (res.ok) {
        const data = await res.json()
        setAcceptedBuddies(data.buddies || [])
      }
    } catch (error) {
      console.error('Error fetching accepted buddies:', error)
    }
  }

  const handleAccept = async (buddyId: string) => {
    try {
      const res = await fetch('/api/study-buddies/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buddyId }),
      })

      if (res.ok) {
        toast.success('Study buddy connection made! 🎉')
        fetchPotentialBuddies()
        fetchAcceptedBuddies()
        // Move to next buddy
        const remaining = buddies.filter((b) => b.id !== buddyId)
        setCurrentBuddy(remaining.length > 0 ? remaining[0] : null)
        setBuddies(remaining)
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const handleSkip = () => {
    if (buddies.length > 1) {
      const remaining = buddies.slice(1)
      setCurrentBuddy(remaining[0])
      setBuddies(remaining)
    } else {
      setCurrentBuddy(null)
      setBuddies([])
    }
  }

  if (loading) return <Layout><div className="p-8">Loading...</div></Layout>

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Your Study Buddy</h1>
          <p className="text-gray-400 text-lg">Connect with learners who match your vibe</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Potential Buddies */}
          <div className="lg:col-span-2">
            {currentBuddy ? (
              <Card glow neon="pink" className="text-center">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-neon-pink to-neon-purple rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold">
                    {currentBuddy.name.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{currentBuddy.name}</h2>
                  {currentBuddy.username && (
                    <p className="text-gray-400 mb-4">@{currentBuddy.username}</p>
                  )}
                  {currentBuddy.bio && (
                    <p className="text-gray-300 mb-4">{currentBuddy.bio}</p>
                  )}

                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-neon-yellow" />
                    <span className="text-2xl font-bold text-neon-yellow">
                      {Math.round(currentBuddy.compatibility)}% Match
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                    {currentBuddy.learningStyle && (
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Learning Style</p>
                        <p className="font-semibold">{currentBuddy.learningStyle}</p>
                      </div>
                    )}
                    {currentBuddy.studyHours && (
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Study Hours</p>
                        <p className="font-semibold">{currentBuddy.studyHours} hrs/day</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      className="flex-1"
                      onClick={handleSkip}
                    >
                      <X className="w-5 h-5 mr-2" />
                      Skip
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => handleAccept(currentBuddy.id)}
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Connect
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-16">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">No more matches</h3>
                  <p className="text-gray-400">Check back later for new study buddy suggestions!</p>
                </div>
              </Card>
            )}
          </div>

          {/* Accepted Buddies */}
          <div>
            <h2 className="text-xl font-bold mb-4">Your Study Buddies</h2>
            {acceptedBuddies.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No connections yet</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {acceptedBuddies.map((buddy) => (
                  <Card key={buddy.id} hover neon="blue">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center font-bold">
                        {buddy.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">{buddy.name}</h3>
                        {buddy.compatibility && (
                          <p className="text-sm text-gray-400">
                            {Math.round(buddy.compatibility)}% match
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}



'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { DoodleStar, DoodleSparkle, DoodleHeart } from '@/components/Doodle'
import { Heart, Sparkles, Users, Target } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block mb-6"
          >
            <DoodleStar className="text-neon-pink w-20 h-20" />
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue bg-clip-text text-transparent">
            About AKSHARA
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
            We're building a learning companion that makes studying feel less lonely, 
            less stressful, and more joyful — one small win at a time.
          </p>
        </motion.div>

        {/* Mission */}
        <Card className="mb-12" glow neon="pink">
          <div className="text-center">
            <DoodleHeart className="text-neon-pink w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              AKSHARA exists to make learning feel good. We believe that every student deserves 
              emotional support, personalized guidance, and a community that celebrates their progress, 
              no matter how small.
            </p>
          </div>
        </Card>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            {
              icon: <Heart className="w-8 h-8 text-neon-pink" />,
              title: 'Warm & Human',
              description: 'We treat you like a friend, not a number. Every interaction is designed to feel supportive and encouraging.',
            },
            {
              icon: <Sparkles className="w-8 h-8 text-neon-purple" />,
              title: 'Playful & Fun',
              description: 'Learning shouldn\'t be boring. We add joy, surprise, and delight to make your journey enjoyable.',
            },
            {
              icon: <Users className="w-8 h-8 text-neon-blue" />,
              title: 'Community First',
              description: 'You\'re never alone. Connect with study buddies, share wins, and support each other.',
            },
            {
              icon: <Target className="w-8 h-8 text-neon-cyan" />,
              title: 'Tiny Wins Matter',
              description: 'We celebrate every small step. Consistency beats perfection, and progress is progress.',
            },
          ].map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card hover neon="purple">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <Card className="text-center" glow neon="blue">
          <DoodleSparkle className="text-neon-blue w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
          <p className="text-gray-300 mb-6">Join AKSHARA and make learning feel good.</p>
          <Link href="/signup">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}



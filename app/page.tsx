'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { DoodleStar, DoodleSparkle } from '@/components/Doodle'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 via-transparent to-neon-purple/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block mb-6"
            >
              <DoodleStar className="text-neon-pink w-16 h-16" />
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue bg-clip-text text-transparent">
              AKSHARA
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
              Your learning companion
            </p>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12">
              A warm, playful, futuristic learning world that makes studying feel less lonely, 
              less stressful, and more joyful — one small win at a time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" variant="primary" glow>
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary">
                  Log In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Tiny Daily Habits',
                description: 'Build consistency with small, achievable wins every day.',
                icon: <DoodleSparkle className="text-neon-yellow w-8 h-8" />,
              },
              {
                title: 'Mood-Aware Learning',
                description: 'Get task suggestions that match your energy and emotions.',
                icon: <DoodleStar className="text-neon-pink w-8 h-8" />,
              },
              {
                title: 'Study Buddies',
                description: 'Find your perfect learning partner and grow together.',
                icon: <DoodleStar className="text-neon-purple w-8 h-8" />,
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + idx * 0.1 }}
                className="bg-dark-card border border-dark-border rounded-2xl p-8 hover:border-neon-pink/50 transition-colors"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}



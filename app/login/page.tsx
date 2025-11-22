'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { DoodleStar } from '@/components/Doodle'
import toast from 'react-hot-toast'
import { useAuth } from '@/app/providers'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter an email')
      return
    }
    
    setLoading(true)

    try {
      // Try backend first
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'any' }),
      })

      const data = await res.json()

      if (res.ok && data.user) {
        setUser(data.user)
        toast.success('Welcome back! 🎉')
        router.push('/home')
        return
      }

      // Backend not available, use mock login
      const mockUser = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        username: email.split('@')[0],
      }
      
      setUser(mockUser)
      localStorage.setItem('mock-user', JSON.stringify(mockUser))
      toast.success('Welcome! 🎉 (Demo Mode)')
      router.push('/home')
    } catch (error: any) {
      // Backend not available, use mock login
      const mockUser = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        username: email.split('@')[0],
      }
      
      setUser(mockUser)
      localStorage.setItem('mock-user', JSON.stringify(mockUser))
      toast.success('Welcome! 🎉 (Demo Mode)')
      router.push('/home')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <DoodleStar className="text-neon-pink w-12 h-12" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-gray-400">Ready to continue your learning journey?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter any password (optional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-neon-pink hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  )
}



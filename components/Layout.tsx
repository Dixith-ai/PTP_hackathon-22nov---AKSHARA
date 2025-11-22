'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Home,
  BookOpen,
  Users,
  Target,
  User,
  Bell,
  LogOut,
  Heart,
  AlertCircle,
  Settings,
} from 'lucide-react'
import { DoodleStar } from './Doodle'
import Button from './ui/Button'

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/courses', icon: BookOpen, label: 'Courses' },
  { href: '/my-courses', icon: BookOpen, label: 'My Courses' },
  { href: '/community', icon: Users, label: 'Community' },
  { href: '/habits', icon: Target, label: 'Habits' },
  { href: '/study-buddy', icon: Heart, label: 'Study Buddy' },
  { href: '/mistakes', icon: AlertCircle, label: 'Mistakes' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, setUser } = useAuth()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
  }

  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-surface border-r border-dark-border p-6 flex flex-col">
        <Link href="/home" className="flex items-center gap-2 mb-8">
          <DoodleStar className="text-neon-pink w-8 h-8" />
          <span className="text-2xl font-bold bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
            AKSHARA
          </span>
        </Link>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive
                    ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/50'
                    : 'text-gray-400 hover:text-white hover:bg-dark-card'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="space-y-2">
          <Link
            href="/notifications"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark-card transition-all"
          >
            <Bell size={20} />
            <span className="font-medium">Notifications</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark-card transition-all"
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </Link>
          <Link
            href="/admin/courses"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark-card transition-all"
          >
            <BookOpen size={20} />
            <span className="font-medium">Admin</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-warm-rose hover:bg-dark-card transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}


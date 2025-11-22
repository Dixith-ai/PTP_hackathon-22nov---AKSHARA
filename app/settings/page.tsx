'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { motion } from 'framer-motion'
import { Bell, Moon, User, Shield, Trash2 } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    habitReminders: true,
    courseUpdates: true,
    communityReplies: true,
    streakCelebrations: true,
    darkMode: true,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    fetchSettings()
  }, [user, loading])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/user/settings')
      if (res.ok) {
        const data = await res.json()
        if (data.settings) {
          setSettings({ ...settings, ...JSON.parse(data.settings) })
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })

      if (res.ok) {
        toast.success('Settings saved! 🎉')
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      return
    }

    try {
      const res = await fetch('/api/user/delete', {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Account deleted')
        router.push('/')
      } else {
        throw new Error('Failed to delete account')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  if (loading) return <Layout><div className="p-8">Loading...</div></Layout>

  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400 text-lg">Manage your preferences and account</p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-neon-pink" />
              <h2 className="text-2xl font-bold">Notifications</h2>
            </div>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications' },
                { key: 'habitReminders', label: 'Habit Reminders' },
                { key: 'courseUpdates', label: 'Course Updates' },
                { key: 'communityReplies', label: 'Community Replies' },
                { key: 'streakCelebrations', label: 'Streak Celebrations' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <label className="text-gray-300">{item.label}</label>
                  <button
                    onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors
                      ${settings[item.key as keyof typeof settings] ? 'bg-neon-pink' : 'bg-dark-surface'}
                    `}
                  >
                    <span
                      className={`
                        absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform
                        ${settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Appearance */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Moon className="w-6 h-6 text-neon-purple" />
              <h2 className="text-2xl font-bold">Appearance</h2>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-300">Dark Mode</label>
              <button
                onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                className={`
                  relative w-12 h-6 rounded-full transition-colors
                  ${settings.darkMode ? 'bg-neon-purple' : 'bg-dark-surface'}
                `}
              >
                <span
                  className={`
                    absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform
                    ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </Card>

          {/* Account */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-neon-blue" />
              <h2 className="text-2xl font-bold">Account</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-gray-300 mb-2">Email</p>
                <p className="text-gray-400">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-300 mb-2">Member since</p>
                <p className="text-gray-400">Recently joined</p>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="border-warm-rose">
            <div className="flex items-center gap-3 mb-6">
              <Trash2 className="w-6 h-6 text-warm-rose" />
              <h2 className="text-2xl font-bold text-warm-rose">Danger Zone</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="ghost" onClick={handleDeleteAccount} className="text-warm-rose hover:bg-warm-rose/10">
              Delete Account
            </Button>
          </Card>

          <div className="flex justify-end">
            <Button variant="primary" onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}



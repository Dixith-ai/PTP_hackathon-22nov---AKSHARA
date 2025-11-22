'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { motion } from 'framer-motion'
import { Bell, Flame, BookOpen, Users, Target } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'
import { formatTimeAgo } from '@/lib/utils'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    fetchNotifications()
  }, [user, loading])

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
      })
      fetchNotifications()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Flame className="w-5 h-5 text-neon-yellow" />
      case 'course':
        return <BookOpen className="w-5 h-5 text-neon-blue" />
      case 'community':
        return <Users className="w-5 h-5 text-neon-purple" />
      case 'habit':
        return <Target className="w-5 h-5 text-neon-pink" />
      default:
        return <Bell className="w-5 h-5 text-neon-cyan" />
    }
  }

  if (loading) return <Layout><div className="p-8">Loading...</div></Layout>

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Notifications</h1>
          <p className="text-gray-400 text-lg">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>

        {notifications.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No notifications</h3>
              <p className="text-gray-400">You're all caught up!</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, idx) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={notification.link || '#'}>
                  <Card
                    hover
                    neon={notification.read ? undefined : 'pink'}
                    className={`cursor-pointer ${!notification.read ? 'border-neon-pink/50' : ''}`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-dark-surface rounded-lg">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-bold text-lg">{notification.title}</h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-neon-pink rounded-full" />
                          )}
                        </div>
                        <p className="text-gray-300 mb-2">{notification.message}</p>
                        <p className="text-sm text-gray-500">{formatTimeAgo(notification.createdAt)}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}



'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { motion } from 'framer-motion'
import { Plus, Heart, MessageCircle, Share2 } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { formatTimeAgo } from '@/lib/utils'

interface Post {
  id: string
  title?: string
  content: string
  type: string
  createdAt: string
  user: {
    name: string
    username?: string
  }
  reactions: { type: string }[]
  comments: { id: string }[]
}

export default function CommunityPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'discussion',
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    fetchPosts()
  }, [user, loading])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/community/posts').catch(() => ({ ok: false }))
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts || [])
      } else {
        // Use mock data
        const { mockPosts } = await import('@/lib/mockData')
        setPosts(mockPosts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      // Fallback to mock data
      const { mockPosts } = await import('@/lib/mockData')
      setPosts(mockPosts)
    }
  }

  const handleCreate = async () => {
    if (!newPost.content.trim()) {
      toast.error('Please enter some content')
      return
    }

    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      }).catch(() => ({ ok: false }))

      if (res.ok) {
        toast.success('Post created! 🎉')
        setShowCreateModal(false)
        setNewPost({ title: '', content: '', type: 'discussion' })
        fetchPosts()
      } else {
        // Mock creation in demo mode
        const newPostWithId = {
          ...newPost,
          id: `post-${Date.now()}`,
          userId: 'mock-user-1',
          user: { name: 'You', email: 'you@example.com' },
          createdAt: new Date().toISOString(),
          reactions: [],
          comments: [],
        }
        setPosts([newPostWithId, ...posts])
        toast.success('Post created! 🎉 (Demo Mode)')
        setShowCreateModal(false)
        setNewPost({ title: '', content: '', type: 'discussion' })
      }
    } catch (error: any) {
      // Mock creation in demo mode
      const newPostWithId = {
        ...newPost,
        id: `post-${Date.now()}`,
        userId: 'mock-user-1',
        user: { name: 'You', email: 'you@example.com' },
        createdAt: new Date().toISOString(),
        reactions: [],
        comments: [],
      }
      setPosts([newPostWithId, ...posts])
      toast.success('Post created! 🎉 (Demo Mode)')
      setShowCreateModal(false)
      setNewPost({ title: '', content: '', type: 'discussion' })
    }
  }

  const handleReaction = async (postId: string) => {
    try {
      const res = await fetch(`/api/community/posts/${postId}/reaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'like' }),
      })

      if (res.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error reacting to post:', error)
    }
  }

  if (loading) return <Layout><div className="p-8">Loading...</div></Layout>

  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Community</h1>
            <p className="text-gray-400 text-lg">Share wins, ask questions, support each other</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Post
          </Button>
        </div>

        {posts.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold mb-2">No posts yet</h3>
              <p className="text-gray-400 mb-6">Be the first to share something!</p>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Create First Post
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card hover neon="purple">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {post.title && (
                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      )}
                      <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
                    </div>
                    <Badge variant="neon" size="sm">{post.type}</Badge>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <span>@{post.user.username || post.user.name}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(post.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleReaction(post.id)}
                        className="flex items-center gap-1 text-gray-400 hover:text-neon-pink transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{post.reactions.length}</span>
                      </button>
                      <div className="flex items-center gap-1 text-gray-400">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments.length}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Post"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <select
              value={newPost.type}
              onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
            >
              <option value="discussion">Discussion</option>
              <option value="question">Question</option>
              <option value="note">Note</option>
              <option value="win">Tiny Win</option>
            </select>
          </div>
          <Input
            label="Title (optional)"
            placeholder="Post title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="What's on your mind?"
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent resize-none"
              rows={6}
            />
          </div>
          <div className="flex gap-4">
            <Button variant="primary" className="flex-1" onClick={handleCreate}>
              Post
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}



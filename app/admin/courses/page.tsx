'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Course {
  id: string
  title: string
  tagline?: string
  description: string
  category: string
  difficulty: string
  duration: number
  isPublished: boolean
}

export default function AdminCoursesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    duration: 60,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    fetchCourses()
  }, [user, loading])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses')
      if (res.ok) {
        const data = await res.json()
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const handleCreate = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success('Course created! 🎉')
        setShowCreateModal(false)
        resetForm()
        fetchCourses()
      } else {
        throw new Error('Failed to create course')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return

    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Course deleted')
        fetchCourses()
      }
    } catch (error) {
      toast.error('Failed to delete course')
    }
  }

  const handleTogglePublish = async (course: Course) => {
    try {
      const res = await fetch(`/api/admin/courses/${course.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !course.isPublished }),
      })

      if (res.ok) {
        toast.success(course.isPublished ? 'Course unpublished' : 'Course published!')
        fetchCourses()
      }
    } catch (error) {
      toast.error('Failed to update course')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      tagline: '',
      description: '',
      category: '',
      difficulty: 'beginner',
      duration: 60,
    })
    setEditingCourse(null)
  }

  if (loading) return <Layout><div className="p-8">Loading...</div></Layout>

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Course Management</h1>
            <p className="text-gray-400 text-lg">Create and manage courses</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Course
          </Button>
        </div>

        {courses.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No courses yet</h3>
              <p className="text-gray-400 mb-6">Create your first course to get started!</p>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Create Course
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card hover neon="purple">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                      {course.tagline && (
                        <p className="text-gray-400 text-sm mb-2">{course.tagline}</p>
                      )}
                      <div className="flex gap-2 mb-2">
                        <Badge variant="neon" size="sm">{course.category}</Badge>
                        <Badge variant="warm" size="sm">{course.difficulty}</Badge>
                        {course.isPublished && (
                          <Badge variant="success" size="sm">Published</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleTogglePublish(course)}
                    >
                      {course.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          resetForm()
        }}
        title="Create New Course"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Course Title *"
            placeholder="e.g., Introduction to React"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Input
            label="Tagline"
            placeholder="Short catchy description"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed course description..."
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent resize-none"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <Input
                placeholder="e.g., Programming"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <Input
            label="Duration (minutes)"
            type="number"
            placeholder="60"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
          />
          <div className="flex gap-4">
            <Button variant="primary" className="flex-1" onClick={handleCreate}>
              Create Course
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowCreateModal(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}



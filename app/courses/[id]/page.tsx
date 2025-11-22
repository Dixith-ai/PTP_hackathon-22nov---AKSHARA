'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { motion } from 'framer-motion'
import { BookOpen, Clock, User, CheckCircle } from 'lucide-react'
import { useAuth } from '@/app/providers'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/Modal'

interface Course {
  id: string
  title: string
  tagline?: string
  description: string
  category: string
  difficulty: string
  duration: number
  instructor?: string
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  order: number
  duration: number
}

export default function CourseDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [showEnrollModal, setShowEnrollModal] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    if (params.id) {
      fetchCourse()
      checkEnrollment()
    }
  }, [params.id, user, loading])

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setCourse(data.course)
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    }
  }

  const checkEnrollment = async () => {
    if (!user) return
    try {
      const res = await fetch(`/api/courses/${params.id}/enrollment`)
      if (res.ok) {
        const data = await res.json()
        setIsEnrolled(data.enrolled)
      }
    } catch (error) {
      console.error('Error checking enrollment:', error)
    }
  }

  const handleEnroll = async () => {
    try {
      const res = await fetch(`/api/courses/${params.id}/enroll`, {
        method: 'POST',
      })

      if (res.ok) {
        toast.success('Enrolled successfully! 🎉')
        setIsEnrolled(true)
        setShowEnrollModal(false)
        router.push(`/courses/${params.id}/lessons/${course?.lessons[0]?.id}`)
      } else {
        throw new Error('Enrollment failed')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  if (loading) return <Layout><div className="p-8">Loading...</div></Layout>
  if (!course) return <Layout><div className="p-8">Course not found</div></Layout>

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <Badge variant="neon" className="mb-4">{course.category}</Badge>
            <h1 className="text-5xl font-bold mb-4">{course.title}</h1>
            {course.tagline && (
              <p className="text-2xl text-gray-300 mb-4">{course.tagline}</p>
            )}
            <p className="text-lg text-gray-400 mb-6">{course.description}</p>

            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-5 h-5" />
                {course.duration} minutes
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <BookOpen className="w-5 h-5" />
                {course.lessons.length} lessons
              </div>
              <Badge variant="warm">{course.difficulty}</Badge>
              {course.instructor && (
                <div className="flex items-center gap-2 text-gray-400">
                  <User className="w-5 h-5" />
                  {course.instructor}
                </div>
              )}
            </div>

            {!isEnrolled ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowEnrollModal(true)}
              >
                Enroll Now
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push(`/courses/${course.id}/lessons/${course.lessons[0]?.id}`)}
              >
                Continue Learning
              </Button>
            )}
          </div>

          {/* Lessons */}
          <Card>
            <h2 className="text-2xl font-bold mb-6">Course Content</h2>
            <div className="space-y-3">
              {course.lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 bg-dark-surface rounded-xl border border-dark-border hover:border-neon-purple/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold">{lesson.title}</h3>
                      <p className="text-sm text-gray-400">{lesson.duration} min</p>
                    </div>
                  </div>
                  {isEnrolled ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/courses/${course.id}/lessons/${lesson.id}`)}
                    >
                      Start
                    </Button>
                  ) : (
                    <CheckCircle className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <Modal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        title="Enroll in Course"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Ready to start learning? You'll get access to all lessons and can track your progress.
          </p>
          <div className="flex gap-4">
            <Button variant="primary" className="flex-1" onClick={handleEnroll}>
              Yes, Enroll Me!
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setShowEnrollModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}



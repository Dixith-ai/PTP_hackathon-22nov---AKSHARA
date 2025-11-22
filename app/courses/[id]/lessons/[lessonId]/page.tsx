'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen, Clock } from 'lucide-react'
import { useAuth } from '@/app/providers'
import toast from 'react-hot-toast'

interface Lesson {
  id: string
  title: string
  content?: string
  videoUrl?: string
  order: number
  duration: number
}

interface Course {
  id: string
  title: string
  lessons: Lesson[]
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [progress, setProgress] = useState(0)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    if (params.id && params.lessonId) {
      fetchLesson()
      fetchCourse()
      fetchProgress()
    }
  }, [params.id, params.lessonId, user, loading])

  const fetchLesson = async () => {
    try {
      const res = await fetch(`/api/courses/${params.id}/lessons/${params.lessonId}`)
      if (res.ok) {
        const data = await res.json()
        setLesson(data.lesson)
        setNotes(data.note?.content || '')
      }
    } catch (error) {
      console.error('Error fetching lesson:', error)
    }
  }

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

  const fetchProgress = async () => {
    try {
      const res = await fetch(`/api/courses/${params.id}/lessons/${params.lessonId}/progress`)
      if (res.ok) {
        const data = await res.json()
        setProgress(data.progress || 0)
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
    }
  }

  const handleProgressUpdate = async (newProgress: number) => {
    setProgress(newProgress)
    try {
      await fetch(`/api/courses/${params.id}/lessons/${params.lessonId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: newProgress }),
      })
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const handleComplete = async () => {
    try {
      const res = await fetch(`/api/courses/${params.id}/lessons/${params.lessonId}/complete`, {
        method: 'POST',
      })

      if (res.ok) {
        toast.success('Lesson completed! 🎉')
        // Move to next lesson
        if (course && lesson) {
          const currentIndex = course.lessons.findIndex((l) => l.id === lesson.id)
          if (currentIndex < course.lessons.length - 1) {
            router.push(`/courses/${params.id}/lessons/${course.lessons[currentIndex + 1].id}`)
          } else {
            router.push(`/courses/${params.id}`)
          }
        }
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const saveNotes = async () => {
    try {
      await fetch(`/api/courses/${params.id}/lessons/${params.lessonId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: notes }),
      })
      toast.success('Notes saved!')
    } catch (error) {
      toast.error('Failed to save notes')
    }
  }

  if (loading) return <Layout><div className="p-8">Loading...</div></Layout>
  if (!lesson || !course) return <Layout><div className="p-8">Lesson not found</div></Layout>

  const currentIndex = course.lessons.findIndex((l) => l.id === lesson.id)
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/courses/${params.id}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge variant="neon" className="mb-2">{course.title}</Badge>
              <h1 className="text-4xl font-bold mb-2">{lesson.title}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {lesson.duration} min
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  Lesson {currentIndex + 1} of {course.lessons.length}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-pink to-neon-purple"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>{Math.round(progress)}% complete</span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => handleProgressUpdate(parseInt(e.target.value))}
                className="w-32"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              {lesson.videoUrl ? (
                <div className="aspect-video bg-dark-surface rounded-xl mb-6 flex items-center justify-center">
                  <p className="text-gray-400">Video Player Placeholder</p>
                  <p className="text-gray-500 text-sm mt-2">URL: {lesson.videoUrl}</p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {lesson.content || 'Lesson content will appear here...'}
                  </p>
                </div>
              )}
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              {prevLesson ? (
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/courses/${params.id}/lessons/${prevLesson.id}`)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Button
                  variant="primary"
                  onClick={() => router.push(`/courses/${params.id}/lessons/${nextLesson.id}`)}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button variant="primary" onClick={handleComplete}>
                  Complete Course
                </Button>
              )}
            </div>
          </div>

          {/* Notes Sidebar */}
          <div>
            <Card>
              <h3 className="text-xl font-bold mb-4">Class Replay Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes as you learn..."
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent resize-none mb-4"
                rows={12}
              />
              <Button variant="primary" className="w-full" onClick={saveNotes}>
                Save Notes
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}



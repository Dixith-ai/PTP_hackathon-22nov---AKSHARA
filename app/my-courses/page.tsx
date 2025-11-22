'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { motion } from 'framer-motion'
import { BookOpen, Clock, ArrowRight, TrendingUp } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatTimeAgo } from '@/lib/utils'

interface EnrolledCourse {
  id: string
  title: string
  tagline?: string
  category: string
  difficulty: string
  progress: number
  enrolledAt: string
  course: {
    id: string
    title: string
    tagline?: string
    category: string
    difficulty: string
    lessonCount: number
    duration: number
  }
}

export default function MyCoursesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<EnrolledCourse[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    fetchCourses()
  }, [user, loading])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses/enrolled')
      if (res.ok) {
        const data = await res.json()
        // Transform to include enrollment data
        const enrollmentsRes = await fetch('/api/courses/enrollments')
        if (enrollmentsRes.ok) {
          const enrollmentsData = await enrollmentsRes.json()
          const coursesWithProgress = data.courses.map((course: any) => {
            const enrollment = enrollmentsData.enrollments.find((e: any) => e.courseId === course.id)
            return {
              ...course,
              progress: enrollment?.progress || 0,
              enrolledAt: enrollment?.enrolledAt || new Date().toISOString(),
            }
          })
          setCourses(coursesWithProgress)
        } else {
          setCourses(data.courses.map((c: any) => ({ ...c, progress: 0, enrolledAt: new Date().toISOString() })))
        }
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  if (loading) return <Layout><div className="p-8">Loading...</div></Layout>

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Courses</h1>
          <p className="text-gray-400 text-lg">Continue your learning journey</p>
        </div>

        {courses.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No courses yet</h3>
              <p className="text-gray-400 mb-6">Start exploring and enroll in your first course!</p>
              <Link href="/courses">
                <Button variant="primary">Browse Courses</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card hover neon="purple">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold">{course.course.title}</h3>
                            <Badge variant="neon" size="sm">{course.course.difficulty}</Badge>
                          </div>
                          {course.course.tagline && (
                            <p className="text-gray-300 mb-3">{course.course.tagline}</p>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Progress</span>
                          <span className="text-sm font-bold text-neon-pink">{Math.round(course.progress)}%</span>
                        </div>
                        <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-neon-pink to-neon-purple"
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.course.lessonCount} lessons
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.course.duration} min
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          Enrolled {formatTimeAgo(course.enrolledAt)}
                        </div>
                      </div>

                      <Link href={`/courses/${course.course.id}`}>
                        <Button variant="primary">
                          Continue Learning
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}



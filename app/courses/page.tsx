'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Clock, Users, Search } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'

interface Course {
  id: string
  title: string
  tagline?: string
  description: string
  category: string
  difficulty: string
  duration: number
  lessonCount: number
  image?: string
}

export default function CoursesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    fetchCourses()
  }, [user, loading])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses').catch(() => null)
      if (res && res.ok) {
        const data = await res.json()
        setCourses(data.courses || [])
      } else {
        // Use mock data
        const { mockCourses } = await import('@/lib/mockData')
        setCourses(mockCourses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      // Fallback to mock data
      const { mockCourses } = await import('@/lib/mockData')
      setCourses(mockCourses)
    }
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || course.category === filter || course.difficulty === filter
    return matchesSearch && matchesFilter
  })

  const categories = Array.from(new Set(courses.map((c) => c.category)))
  const difficulties = ['beginner', 'intermediate', 'advanced']

  if (loading) return <Layout><div className="p-8">Loading...</div></Layout>

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Explore Courses</h1>
          <p className="text-gray-400 text-lg">Find the perfect course for your learning journey</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={filter === cat ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter(cat)}
              >
                {cat}
              </Button>
            ))}
            {difficulties.map((diff) => (
              <Button
                key={diff}
                variant={filter === diff ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter(diff)}
              >
                {diff}
              </Button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No courses found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/courses/${course.id}`}>
                  <Card hover neon="purple" className="h-full">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold">{course.title}</h3>
                        <Badge variant="neon" size="sm">{course.difficulty}</Badge>
                      </div>
                      {course.tagline && (
                        <p className="text-gray-400 text-sm mb-2">{course.tagline}</p>
                      )}
                      <p className="text-gray-300 text-sm line-clamp-2">{course.description}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {course.lessonCount} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration} min
                      </div>
                    </div>

                    <Button variant="primary" className="w-full">View Course</Button>
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



'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { motion } from 'framer-motion'
import { AlertCircle, TrendingDown, Lightbulb, Target } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'
import { formatTimeAgo } from '@/lib/utils'

interface Mistake {
  id: string
  type: string
  content: string
  pattern?: string
  createdAt: string
  lesson?: {
    title: string
    course?: {
      title: string
    }
  }
}

interface MistakePattern {
  pattern: string
  count: number
  mistakes: Mistake[]
  suggestions: string[]
}

export default function MistakesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [patterns, setPatterns] = useState<MistakePattern[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    fetchMistakes()
  }, [user, loading])

  const fetchMistakes = async () => {
    try {
      const res = await fetch('/api/mistakes')
      if (res.ok) {
        const data = await res.json()
        setMistakes(data.mistakes || [])
        
        // Group by pattern
        const patternMap = new Map<string, Mistake[]>()
        data.mistakes.forEach((mistake: Mistake) => {
          const pattern = mistake.pattern || 'general'
          if (!patternMap.has(pattern)) {
            patternMap.set(pattern, [])
          }
          patternMap.get(pattern)!.push(mistake)
        })

        const patternArray: MistakePattern[] = Array.from(patternMap.entries()).map(([pattern, mistakes]) => ({
          pattern,
          count: mistakes.length,
          mistakes,
          suggestions: generateSuggestions(pattern, mistakes),
        }))

        patternArray.sort((a, b) => b.count - a.count)
        setPatterns(patternArray)
      }
    } catch (error) {
      console.error('Error fetching mistakes:', error)
    }
  }

  const generateSuggestions = (pattern: string, mistakes: Mistake[]): string[] => {
    const suggestions: string[] = []
    
    if (pattern.includes('concept')) {
      suggestions.push('Review the core concepts for this topic')
      suggestions.push('Try explaining the concept to someone else')
    } else if (pattern.includes('calculation')) {
      suggestions.push('Practice similar calculations step by step')
      suggestions.push('Double-check your work before submitting')
    } else if (pattern.includes('application')) {
      suggestions.push('Work through more practice problems')
      suggestions.push('Focus on understanding when to apply this concept')
    } else {
      suggestions.push('Review the related lesson material')
      suggestions.push('Practice similar problems')
    }

    return suggestions
  }

  if (loading) return <Layout><div className="p-8">Loading...</div></Layout>

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mistake Insights</h1>
          <p className="text-gray-400 text-lg">
            Learn from your mistakes and turn them into growth opportunities
          </p>
        </div>

        {mistakes.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No mistakes tracked yet</h3>
              <p className="text-gray-400">
                As you learn, we'll help you identify patterns and improve!
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Patterns Overview */}
            {patterns.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Common Patterns</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {patterns.map((pattern, idx) => (
                    <motion.div
                      key={pattern.pattern}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card hover neon="purple">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-1 capitalize">{pattern.pattern}</h3>
                            <p className="text-gray-400 text-sm">{pattern.count} occurrences</p>
                          </div>
                          <Badge variant="warm">{pattern.count}x</Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-gray-300 mb-2">Improvement suggestions:</p>
                          {pattern.suggestions.map((suggestion, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                              <Lightbulb className="w-4 h-4 text-neon-yellow mt-0.5 flex-shrink-0" />
                              <span>{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* All Mistakes */}
            <div>
              <h2 className="text-2xl font-bold mb-4">All Mistakes</h2>
              <div className="space-y-4">
                {mistakes.map((mistake, idx) => (
                  <motion.div
                    key={mistake.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card hover>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-warm-rose/20 rounded-xl">
                          <AlertCircle className="w-6 h-6 text-warm-rose" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="warm" size="sm">{mistake.type}</Badge>
                            {mistake.pattern && (
                              <Badge variant="neon" size="sm">{mistake.pattern}</Badge>
                            )}
                          </div>
                          <p className="text-gray-300 mb-2">{mistake.content}</p>
                          {mistake.lesson && (
                            <p className="text-sm text-gray-500">
                              From: {mistake.lesson.course?.title} - {mistake.lesson.title}
                            </p>
                          )}
                          <p className="text-xs text-gray-600 mt-2">
                            {formatTimeAgo(mistake.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}



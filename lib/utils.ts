import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return formatDate(d)
}

export function calculateCompatibility(user1: any, user2: any): number {
  let score = 50 // Base compatibility

  // Learning style match
  if (user1.learningStyle === user2.learningStyle) score += 15

  // Study hours overlap
  if (user1.studyHours && user2.studyHours) {
    const diff = Math.abs(user1.studyHours - user2.studyHours)
    score += Math.max(0, 15 - diff)
  }

  // Interests overlap
  if (user1.interests && user2.interests) {
    const interests1 = user1.interests.split(',').map((i: string) => i.trim())
    const interests2 = user2.interests.split(',').map((i: string) => i.trim())
    const common = interests1.filter((i: string) => interests2.includes(i))
    score += (common.length / Math.max(interests1.length, interests2.length)) * 20
  }

  return Math.min(100, Math.max(0, score))
}

export function getMoodColor(mood: string): string {
  const colors: Record<string, string> = {
    energetic: 'neon-yellow',
    calm: 'neon-cyan',
    stressed: 'warm-rose',
    focused: 'neon-blue',
    tired: 'neon-purple',
    excited: 'neon-pink',
  }
  return colors[mood] || 'neon-blue'
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    easy: 'neon-green',
    medium: 'neon-yellow',
    hard: 'warm-orange',
  }
  return colors[difficulty] || 'neon-blue'
}



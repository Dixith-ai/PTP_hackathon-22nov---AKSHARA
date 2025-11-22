// Mock data for frontend-only deployment
export const mockUser = {
  id: 'mock-user-1',
  email: 'demo@example.com',
  name: 'Demo User',
  username: 'demo',
}

export const mockHabits = [
  {
    id: 'habit-1',
    title: 'Read for 15 minutes',
    description: 'Daily reading habit',
    type: 'daily',
    difficulty: 'easy',
    isActive: true,
    completions: [],
  },
  {
    id: 'habit-2',
    title: 'Practice coding',
    description: 'Code for at least 30 minutes',
    type: 'daily',
    difficulty: 'medium',
    isActive: true,
    completions: [],
  },
]

export const mockStreaks = [
  {
    id: 'streak-1',
    type: 'daily',
    count: 7,
  },
]

export const mockCourses = [
  {
    id: 'course-1',
    title: 'Introduction to Web Development',
    tagline: 'Build your first website',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to create beautiful and interactive websites.',
    category: 'Web Development',
    difficulty: 'beginner',
    duration: 120,
    lessonCount: 8,
    image: undefined,
    isPublished: true,
    lessons: [
      {
        id: 'lesson-1',
        title: 'Getting Started with HTML',
        content: 'Learn the basics of HTML structure',
        videoUrl: undefined,
        order: 1,
        duration: 15,
      },
      {
        id: 'lesson-2',
        title: 'Styling with CSS',
        content: 'Make your pages beautiful with CSS',
        videoUrl: undefined,
        order: 2,
        duration: 20,
      },
    ],
  },
  {
    id: 'course-2',
    title: 'React Fundamentals',
    tagline: 'Master modern React',
    description: 'Dive deep into React hooks, components, and state management to build dynamic user interfaces.',
    category: 'Web Development',
    difficulty: 'intermediate',
    duration: 180,
    lessonCount: 12,
    image: undefined,
    isPublished: true,
    lessons: [
      {
        id: 'lesson-3',
        title: 'Components and Props',
        content: 'Understanding React components',
        videoUrl: undefined,
        order: 1,
        duration: 25,
      },
    ],
  },
  {
    id: 'course-3',
    title: 'Data Structures & Algorithms',
    tagline: 'Think like a programmer',
    description: 'Master fundamental data structures and algorithms to solve complex programming problems efficiently.',
    category: 'Computer Science',
    difficulty: 'advanced',
    duration: 240,
    lessonCount: 15,
    image: undefined,
    isPublished: true,
    lessons: [],
  },
]

export const mockPosts = [
  {
    id: 'post-1',
    userId: 'mock-user-1',
    user: { name: 'Demo User', email: 'demo@example.com' },
    title: 'Just completed my first course!',
    content: 'Feeling so accomplished after finishing the web development course. The projects were challenging but so rewarding!',
    type: 'win',
    courseId: null,
    createdAt: new Date().toISOString(),
    reactions: [],
    comments: [],
  },
  {
    id: 'post-2',
    userId: 'mock-user-1',
    user: { name: 'Demo User', email: 'demo@example.com' },
    title: 'Question about React hooks',
    content: 'Can someone explain the difference between useState and useEffect? I\'m a bit confused.',
    type: 'question',
    courseId: 'course-2',
    createdAt: new Date().toISOString(),
    reactions: [],
    comments: [],
  },
]

export const mockBadges = [
  {
    id: 'badge-1',
    type: 'streak',
    name: '7 Day Streak',
    icon: '🔥',
    earnedAt: new Date().toISOString(),
  },
]

export const mockEmotions = {
  mood: 'energetic',
  intensity: 7,
}

// Helper to check if we're in frontend-only mode
export const isFrontendOnly = () => {
  return typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     process.env.NEXT_PUBLIC_FRONTEND_ONLY === 'true')
}

// Simulate API delay
export const mockDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms))


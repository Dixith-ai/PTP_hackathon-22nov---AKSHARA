// API client that falls back to mock data when backend is unavailable
import {
  mockHabits,
  mockStreaks,
  mockCourses,
  mockPosts,
  mockBadges,
  mockEmotions,
  mockDelay,
} from './mockData'

interface ApiResponse<T> {
  data?: T
  error?: string
  ok: boolean
}

// Generic API wrapper that falls back to mock data
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit,
  mockData: T
): Promise<{ ok: boolean; data: T }> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return { ok: true, data }
    }

    // If backend returns error, use mock data
    throw new Error('Backend unavailable')
  } catch (error) {
    // Backend not available, return mock data
    await mockDelay(300) // Simulate network delay
    return { ok: true, data: mockData }
  }
}

// API functions with mock fallbacks
export const api = {
  // Habits
  getHabits: () => apiCall('/api/habits', {}, { habits: mockHabits }),
  createHabit: (habit: any) => {
    const newHabit = {
      ...habit,
      id: `habit-${Date.now()}`,
      isActive: true,
      completions: [],
    }
    return apiCall('/api/habits', {
      method: 'POST',
      body: JSON.stringify(habit),
    }, { habit: newHabit })
  },
  completeHabit: (habitId: string) => 
    apiCall('/api/habits/complete', {
      method: 'POST',
      body: JSON.stringify({ habitId }),
    }, { success: true }),

  // Streaks
  getStreaks: () => apiCall('/api/streaks', {}, { streaks: mockStreaks }),

  // Courses
  getCourses: () => apiCall('/api/courses', {}, { courses: mockCourses }),
  getCourse: (id: string) => {
    const course = mockCourses.find(c => c.id === id) || mockCourses[0]
    return apiCall(`/api/courses/${id}`, {}, { course })
  },
  getEnrolledCourses: () => apiCall('/api/courses/enrolled', {}, { courses: [] }),

  // Community
  getPosts: () => apiCall('/api/community/posts', {}, { posts: mockPosts }),
  createPost: (post: any) => {
    const newPost = {
      ...post,
      id: `post-${Date.now()}`,
      userId: 'mock-user-1',
      user: { name: 'You', email: 'you@example.com' },
      createdAt: new Date().toISOString(),
      reactions: [],
      comments: [],
    }
    return apiCall('/api/community/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    }, { post: newPost })
  },
  reactToPost: (postId: string, type: string) =>
    apiCall(`/api/community/posts/${postId}/reaction`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    }, { success: true }),

  // Emotions
  getLatestEmotion: () => apiCall('/api/emotions/latest', {}, { mood: mockEmotions.mood }),
  createEmotion: (emotion: any) =>
    apiCall('/api/emotions', {
      method: 'POST',
      body: JSON.stringify(emotion),
    }, { success: true }),

  // Badges
  getBadges: () => apiCall('/api/badges', {}, { badges: mockBadges }),

  // User Profile
  getProfile: () => apiCall('/api/user/profile', {}, {
    name: 'Demo User',
    username: 'demo',
    bio: 'Learning and growing every day!',
  }),
  updateProfile: (profile: any) =>
    apiCall('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }, { success: true }),
}


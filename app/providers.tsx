'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { mockUser } from '@/lib/mockData'

interface User {
  id: string
  email: string
  name: string
  username?: string | null
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
})

export function useAuth() {
  return useContext(AuthContext)
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage first (for frontend-only mode)
    const storedUser = localStorage.getItem('mock-user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        setLoading(false)
        return
      } catch (e) {
        // Invalid stored data, continue to API check
      }
    }

    // Try to check backend session
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        } else {
          // Backend not available, use mock user
          setUser(mockUser)
          localStorage.setItem('mock-user', JSON.stringify(mockUser))
        }
        setLoading(false)
      })
      .catch(() => {
        // Backend not available, use mock user
        setUser(mockUser)
        localStorage.setItem('mock-user', JSON.stringify(mockUser))
        setLoading(false)
      })
  }, [])

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('mock-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('mock-user')
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}


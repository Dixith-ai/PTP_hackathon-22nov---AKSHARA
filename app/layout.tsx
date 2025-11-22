import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'AKSHARA - Your Learning Companion',
  description: 'A warm, playful, futuristic learning world that blends productivity, mood awareness, and AI personalization.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a26',
                color: '#fff',
                border: '1px solid rgba(255, 107, 157, 0.3)',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#34d399',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#f87171',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}



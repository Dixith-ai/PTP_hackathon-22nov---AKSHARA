'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'neon'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', glow = false, children, ...props }, ref) => {
    const baseStyles = 'font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg'
    
    const variants = {
      primary: 'bg-neon-pink text-white hover:bg-neon-pink/90 focus:ring-neon-pink',
      secondary: 'bg-dark-card text-white border border-dark-border hover:bg-dark-surface focus:ring-neon-purple',
      ghost: 'bg-transparent text-white hover:bg-dark-card focus:ring-neon-blue',
      neon: 'bg-transparent text-neon-pink border-2 border-neon-pink hover:bg-neon-pink/10 focus:ring-neon-pink',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    const glowClass = glow ? 'animate-pulse-neon' : ''

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          glowClass,
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button


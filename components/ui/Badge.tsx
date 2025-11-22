'use client'

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'neon' | 'warm' | 'success'
  size?: 'sm' | 'md' | 'lg'
}

export default function Badge({ className, variant = 'default', size = 'md', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-dark-surface text-gray-300 border-dark-border',
    neon: 'bg-neon-pink/20 text-neon-pink border-neon-pink/50',
    warm: 'bg-warm-orange/20 text-warm-orange border-warm-orange/50',
    success: 'bg-neon-green/20 text-neon-green border-neon-green/50',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center border rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}



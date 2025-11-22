'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl',
            'text-white placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent',
            'transition-all duration-200',
            error && 'border-warm-rose focus:ring-warm-rose',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-warm-rose">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input



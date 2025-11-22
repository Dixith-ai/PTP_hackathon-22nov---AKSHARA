'use client'

import { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  glow?: boolean
  hover?: boolean
  neon?: 'pink' | 'purple' | 'blue' | 'cyan' | 'green' | 'yellow'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow = false, hover = true, neon, children, ...props }, ref) => {
    const neonGlow = neon ? `glow-${neon}` : ''
    const neonBorder = neon ? `border-${neon}` : 'border-dark-border'

    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -4, scale: 1.01 } : {}}
        transition={{ duration: 0.2 }}
        className={cn(
          'bg-dark-card border rounded-2xl p-6 transition-all duration-200',
          neonBorder,
          glow && neonGlow,
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

export default Card


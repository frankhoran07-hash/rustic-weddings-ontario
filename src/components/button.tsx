import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'lg'
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  type = 'submit',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors',
        variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        variant === 'outline' && 'border border-border bg-background hover:bg-muted',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        variant === 'ghost' && 'hover:bg-muted',
        size === 'default' && 'h-10 px-5',
        size === 'lg' && 'h-12 px-7',
        className,
      )}
      {...props}
    />
  )
}

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-body font-medium transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-ink text-paper hover:bg-pink',
        outline: 'border border-ink/25 text-ink hover:border-pink hover:text-pink',
        'outline-paper': 'border border-paper/30 text-paper hover:border-pink-soft hover:text-pink-soft',
        ghost: 'text-ink hover:text-pink',
      },
      size: {
        default: 'h-11 px-6 text-sm',
        lg: 'h-14 px-9 text-base',
        sm: 'h-9 px-4 text-xs',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

type ButtonProps = React.ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: never }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
)
Button.displayName = 'Button'

export { Button, buttonVariants }

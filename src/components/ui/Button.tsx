import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2',
          size === 'md' && 'h-[50px] px-7 text-[15px] rounded-[14px]',
          size === 'sm' && 'h-9 px-4 text-[13px] rounded-[12px]',
          variant === 'primary' && 'bg-[#53603E] text-[#F5F1DD] hover:bg-[#475435] active:scale-[0.97] focus-visible:outline-[#53603E]',
          variant === 'outline' && 'bg-transparent text-[#53603E] border border-[#E8E4D4] hover:border-[#53603E] hover:bg-[#F5F3E8] active:scale-[0.97] focus-visible:outline-[#53603E]',
          variant === 'ghost' && 'bg-transparent text-[#8A8577] hover:text-[#53603E] active:scale-[0.97]',
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            {children}
          </span>
        ) : children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button

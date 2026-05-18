import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-[12px] font-medium tracking-wide text-[#6D412A] uppercase"
        >
          {label}
          {props.required && <span className="text-[#DC2626] ml-0.5">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-12 w-full rounded-[12px] border border-[#E8E4D4] bg-[#FAFAF5] px-4 text-[15px] text-[#2D2D2A]',
            'placeholder:text-[#B8B3A0]',
            'focus:outline-none focus:border-[#53603E] focus:ring-2 focus:ring-[#53603E]/10',
            'transition-colors duration-150',
            error && 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/10',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-[12px] text-[#8A8577]">{hint}</p>
        )}
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-[12px] text-[#DC2626]"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input

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
            'h-[46px] w-full rounded-[12px] border-[1.5px] border-[#E2DCC6] bg-white px-4 text-[15px] text-[#241F18]',
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
          <p id={`${inputId}-hint`} className="text-[12px] text-[#6E6A5C]">{hint}</p>
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

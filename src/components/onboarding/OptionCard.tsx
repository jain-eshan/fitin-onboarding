import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

type OptionCardProps = {
  letter: string
  label: string
  sublabel?: string
  selected: boolean
  onSelect: () => void
  disabled?: boolean
}

export default function OptionCard({
  letter,
  label,
  sublabel,
  selected,
  onSelect,
  disabled = false,
}: OptionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      aria-pressed={selected}
      className={cn(
        'w-full flex items-center gap-3.5 rounded-[14px] border-[1.5px] px-4 py-3.5 text-left',
        'transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#53603E] focus-visible:outline-offset-2',
        'min-h-[52px]',
        selected
          ? 'border-[#53603E] bg-[#EEF0E6]'
          : 'border-[#E2DCC6] bg-[#FAFAF5] hover:border-[#53603E] hover:bg-[#F5F3E8]',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] text-[13px] font-semibold transition-colors duration-150',
          selected
            ? 'bg-[#53603E] text-[#F5F1DD]'
            : 'bg-[#F0EDE0] text-[#53603E]'
        )}
      >
        {letter}
      </span>

      <span className="flex-1 min-w-0">
        <span className="block text-[14.5px] font-medium text-[#241F18] leading-snug">
          {label}
        </span>
        {sublabel && (
          <span className="block text-[12px] text-[#6E6A5C] mt-0.5">
            {sublabel}
          </span>
        )}
      </span>

      <span
        className={cn(
          'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors duration-150',
          selected
            ? 'bg-[#53603E] border-[#53603E]'
            : 'bg-transparent border-[#D4D0C0]'
        )}
        aria-hidden="true"
      >
        {selected && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#F5F1DD" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </motion.button>
  )
}

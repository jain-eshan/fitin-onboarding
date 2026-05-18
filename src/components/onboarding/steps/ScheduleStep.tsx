import { useEffect } from 'react'
import OptionCard from '../OptionCard'

const OPTIONS = [
  { value: 'early_morning', letter: 'A', label: 'Early morning', sublabel: 'Before 8 AM' },
  { value: 'morning',       letter: 'B', label: 'Morning',       sublabel: '8 AM – 12 PM' },
  { value: 'evening',       letter: 'C', label: 'Evening',       sublabel: 'After 6 PM' },
  { value: 'flexible',      letter: 'D', label: 'It changes daily', sublabel: 'I need flexibility' },
]

type ScheduleStepProps = {
  value: string | null
  onChange: (val: string) => void
  onNext: () => void
}

export default function ScheduleStep({ value, onChange, onNext }: ScheduleStepProps) {
  useEffect(() => {
    if (!value) return
    const timer = setTimeout(onNext, 400)
    return () => clearTimeout(timer)
  }, [value, onNext])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2
          className="text-[22px] font-semibold tracking-[-0.02em] text-[#2D2D2A] leading-[1.3]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          When does your schedule have a gap?
        </h2>
        <p className="text-[13px] text-[#8A8577]">
          Even 15 minutes is enough to start.
        </p>
      </div>

      <div role="radiogroup" aria-label="Preferred workout time" className="flex flex-col gap-2.5">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            letter={opt.letter}
            label={opt.label}
            sublabel={opt.sublabel}
            selected={value === opt.value}
            onSelect={() => onChange(opt.value)}
          />
        ))}
      </div>
    </div>
  )
}

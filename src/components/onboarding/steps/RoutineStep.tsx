import { useEffect } from 'react'
import OptionCard from '../OptionCard'

const OPTIONS = [
  { value: 'inactive',   letter: 'A', label: 'Mostly inactive',  sublabel: 'Desk job, occasional walks' },
  { value: 'on_and_off', letter: 'B', label: 'On and off',        sublabel: "I try, but can't stay consistent" },
  { value: 'active',     letter: 'C', label: 'Fairly active',     sublabel: 'Regular movement, want structure' },
]

type RoutineStepProps = {
  name?: string
  value: string | null
  onChange: (val: string) => void
  onNext: () => void
}

export default function RoutineStep({ value, onChange, onNext }: RoutineStepProps) {  // name prop accepted but not used in heading
  useEffect(() => {
    if (!value) return
    const timer = setTimeout(onNext, 400)
    return () => clearTimeout(timer)
  }, [value, onNext])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2
          className="text-[30px] font-semibold tracking-[-0.015em] text-[#241F18] leading-[1.22]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          How would you describe your current routine?
        </h2>
        <p className="text-[15px] text-[#6E6A5C]">
          Be honest — that's where good plans start.
        </p>
      </div>

      <div role="radiogroup" aria-label="Current routine" className="flex flex-col gap-2.5">
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

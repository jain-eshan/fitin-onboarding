import { useEffect } from 'react'
import OptionCard from '../OptionCard'

const OPTIONS = [
  { value: 'unaware', letter: 'A', label: "I eat whatever's around",  sublabel: "Don't think about it much" },
  { value: 'trying',  letter: 'B', label: 'Trying to eat better',     sublabel: 'Some awareness, not consistent' },
  { value: 'mindful', letter: 'C', label: 'Pretty mindful',           sublabel: 'I plan or track most meals' },
]

type DietStepProps = {
  name?: string
  value: string | null
  onChange: (val: string) => void
  onNext: () => void
}

export default function DietStep({ value, onChange, onNext }: DietStepProps) {  // name prop accepted but not used in heading
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
          How would you describe your eating habits?
        </h2>
        <p className="text-[15px] text-[#6E6A5C]">
          No judgment — just helps us understand where you are.
        </p>
      </div>

      <div role="radiogroup" aria-label="Eating habits" className="flex flex-col gap-2.5">
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

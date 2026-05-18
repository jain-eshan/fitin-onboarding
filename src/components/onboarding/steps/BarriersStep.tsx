import OptionCard from '../OptionCard'
import Button from '../../ui/Button'

const OPTIONS = [
  { value: 'no_time',      letter: 'A', label: 'No time',                    sublabel: 'Schedule is unpredictable' },
  { value: 'dont_know',    letter: 'B', label: "Don't know where to begin" },
  { value: 'start_stop',   letter: 'C', label: 'Start strong, lose steam' },
  { value: 'intimidation', letter: 'D', label: 'Gyms feel intimidating' },
]

type BarriersStepProps = {
  value: string[]
  onToggle: (val: string) => void
  onNext: () => void
}

export default function BarriersStep({ value, onToggle, onNext }: BarriersStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2
          className="text-[22px] font-semibold tracking-[-0.02em] text-[#2D2D2A] leading-[1.3]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          What's made it hard to stay consistent?
        </h2>
        <span className="inline-flex self-start rounded-[6px] bg-[#F0EDE0] px-2 py-1 text-[11px] font-medium text-[#6D412A]">
          Select all that apply
        </span>
      </div>

      <div className="flex flex-col gap-2.5" role="group" aria-label="Barriers to consistency">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            letter={opt.letter}
            label={opt.label}
            sublabel={opt.sublabel}
            selected={value.includes(opt.value)}
            onSelect={() => onToggle(opt.value)}
          />
        ))}
      </div>

      {value.length > 0 && (
        <Button onClick={onNext} className="w-full">
          Continue
        </Button>
      )}
    </div>
  )
}

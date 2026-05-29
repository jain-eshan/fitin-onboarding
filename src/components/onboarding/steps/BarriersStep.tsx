import OptionCard from '../OptionCard'
import Button from '../../ui/Button'

const OPTIONS = [
  { value: 'no_time',      letter: 'A', label: 'No time',                    sublabel: 'Schedule is unpredictable' },
  { value: 'dont_know',    letter: 'B', label: "Don't know where to begin" },
  { value: 'start_stop',   letter: 'C', label: 'Start strong, lose steam' },
  { value: 'intimidation', letter: 'D', label: 'Gyms feel intimidating' },
]

type BarriersStepProps = {
  name?: string
  value: string[]
  onToggle: (val: string) => void
  onNext: () => void
}

export default function BarriersStep({ name, value, onToggle, onNext }: BarriersStepProps) {
  const firstName = name ? name.split(' ')[0] : ''
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2
          className="text-[30px] font-semibold tracking-[-0.015em] text-[#241F18] leading-[1.22]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {firstName ? `What's held you back, ${firstName}?` : `What's made it hard to stay consistent?`}
        </h2>
        <p className="text-[15px] text-[#6E6A5C]">Honest answers help us help you.</p>
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

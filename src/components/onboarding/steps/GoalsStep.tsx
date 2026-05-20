import OptionCard from '../OptionCard'
import Button from '../../ui/Button'

const OPTIONS = [
  { value: 'strength', letter: 'A', label: 'Build strength' },
  { value: 'weight',   letter: 'B', label: 'Manage weight' },
  { value: 'energy',   letter: 'C', label: 'More daily energy' },
  { value: 'sleep',    letter: 'D', label: 'Better sleep' },
]

type GoalsStepProps = {
  name?: string
  value: string[]
  onToggle: (val: string) => void
  onNext: () => void
}

export default function GoalsStep({ name, value, onToggle, onNext }: GoalsStepProps) {
  const firstName = name ? name.split(' ')[0] : ''

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2
          className="text-[22px] font-semibold tracking-[-0.02em] text-[#2D2D2A] leading-[1.3]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {firstName
            ? `What does 'fit' look like for you, ${firstName}?`
            : `What does 'fit' look like for you?`}
        </h2>
        <span className="inline-flex self-start rounded-[6px] bg-[#F0EDE0] px-2 py-1 text-[11px] font-medium text-[#6D412A]">
          Pick everything that matters to you
        </span>
      </div>

      <div className="flex flex-col gap-2.5" role="group" aria-label="Fitness goals">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            letter={opt.letter}
            label={opt.label}
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

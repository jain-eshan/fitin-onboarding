import Button from '../../ui/Button'

type WelcomeStepProps = {
  onNext: () => void
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1
          className="text-[26px] font-semibold tracking-[-0.02em] text-[#2D2D2A] leading-[1.25]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Let's find your fitness style.
        </h1>
        <p className="text-[14px] text-[#8A8577] leading-relaxed">
          8 quick questions so your trainer can prepare a plan that actually works for your life.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          onClick={onNext}
          className="w-full"
          aria-label="Start the fitness quiz"
        >
          Let's start →
        </Button>
        <p className="text-center text-[12px] text-[#B8B3A0]">
          Takes about 90 seconds
        </p>
      </div>
    </div>
  )
}

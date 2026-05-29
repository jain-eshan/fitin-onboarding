import Button from '../../ui/Button'

type IntroStepProps = {
  onNext: () => void
}

export default function IntroStep({ onNext }: IntroStepProps) {
  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Badge */}
      <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EEF0E6] px-3 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#53603E]" aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#53603E]">
          FitIn Club · Free Quiz
        </span>
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-3">
        <h1
          className="text-[34px] font-bold tracking-[-0.02em] text-[#241F18] leading-[1.08]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Find your fitness style in 2 minutes.
        </h1>
        <p className="text-[17px] text-[#6E6A5C] leading-relaxed">
          Answer a few quick questions about your lifestyle and goals. We'll build a fitness profile that actually fits — and match you with a trainer who gets it.
        </p>
      </div>

      {/* What you get */}
      <div className="flex flex-col gap-2.5">
        {[
          { icon: '✦', text: 'A personalised fitness profile — based on your answers' },
          { icon: '✦', text: 'A recommended program from our trainers' },
          { icon: '✦', text: 'A free 1:1 intro call — no commitment' },
        ].map(item => (
          <div key={item.text} className="flex items-start gap-2.5">
            <span className="mt-0.5 text-[12px] text-[#FBA327] font-bold">{item.icon}</span>
            <p className="text-[14px] text-[#241F18]">{item.text}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-2 pt-2">
        <Button onClick={onNext} className="w-full">
          Find my fitness style →
        </Button>
        <p className="text-center text-[12px] text-[#B8B3A0]">
          Takes about 2 minutes · No credit card needed
        </p>
      </div>
    </div>
  )
}

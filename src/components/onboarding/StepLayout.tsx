import ProgressBar from '../ui/ProgressBar'
import { TOTAL_QUIZ_STEPS } from '../../types/onboarding'

type StepLayoutProps = {
  stepIndex: number
  progressPercent: number
  onBack?: () => void
  children: React.ReactNode
}

export default function StepLayout({
  stepIndex,
  progressPercent,
  onBack,
  children,
}: StepLayoutProps) {
  const showBack = stepIndex > 0
  const showStep = stepIndex > 0 && stepIndex <= TOTAL_QUIZ_STEPS

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAFAF5]">
      <header className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={onBack}
              aria-label="Go back"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#8A8577] hover:bg-[#F0EDE0] hover:text-[#53603E] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#53603E]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <span
              className="text-[17px] font-semibold tracking-[-0.03em] text-[#53603E]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              fit in<span className="text-[#FBA327]">.</span> club
            </span>
          )}

          {showBack && (
            <span
              className="text-[16px] font-semibold tracking-[-0.02em] text-[#53603E]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              fit in<span className="text-[#FBA327]">.</span> club
            </span>
          )}
        </div>

        {showStep && (
          <span className="text-[12px] font-medium text-[#8A8577]">
            {stepIndex} of {TOTAL_QUIZ_STEPS}
          </span>
        )}
      </header>

      <ProgressBar percent={progressPercent} />

      <main className="flex flex-1 flex-col items-center px-5 pt-8 pb-10">
        <div className="w-full max-w-[480px]">
          {children}
        </div>
      </main>
    </div>
  )
}

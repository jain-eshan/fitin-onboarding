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
      {/* Header — matches fitin.club website */}
      <header className="w-full bg-[#53603E] px-4 pt-4 pb-3">
        <div className="mx-auto flex max-w-[900px] items-center justify-between rounded-[18px] bg-white px-4 py-3 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
          {/* Left: back button (steps 2+) */}
          <div className="flex w-10 items-center">
            {showBack && (
              <button
                onClick={onBack}
                aria-label="Go back"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#8A8577] hover:bg-[#F0EDE0] hover:text-[#53603E] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#53603E]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>

          {/* Center: FitIn logo */}
          <div className="flex flex-1 justify-center">
            <img
              src="/fitin-logo.png"
              alt="FitIn Club"
              className="h-9 w-auto object-contain"
              draggable={false}
            />
          </div>

          {/* Right: step counter */}
          <div className="flex w-10 justify-end">
            {showStep && (
              <span className="text-[11px] font-medium text-[#8A8577] tabular-nums">
                {stepIndex}/{TOTAL_QUIZ_STEPS}
              </span>
            )}
          </div>
        </div>
      </header>

      <ProgressBar percent={progressPercent} />

      {/* Content — white card area */}
      <main className="flex flex-1 flex-col items-center px-4 pt-6 pb-10">
        <div className="w-full max-w-[480px]">
          {children}
        </div>
      </main>
    </div>
  )
}

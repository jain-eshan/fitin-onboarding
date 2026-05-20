import ProgressBar from '../ui/ProgressBar'
import { TOTAL_QUIZ_STEPS } from '../../types/onboarding'

type StepLayoutProps = {
  stepIndex: number
  progressPercent: number
  onBack?: () => void
  children: React.ReactNode
  showProgress?: boolean
}

export default function StepLayout({
  stepIndex,
  progressPercent,
  onBack,
  children,
  showProgress = true,
}: StepLayoutProps) {
  const showBack = stepIndex > 1
  const showStep = stepIndex >= 1 && stepIndex <= TOTAL_QUIZ_STEPS

  return (
    <div className="flex flex-col bg-white" style={{ minHeight: '100dvh' }}>
      {/* Top bar: back + step counter */}
      {(showBack || showStep) && (
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="w-8">
            {showBack && (
              <button
                onClick={onBack}
                aria-label="Go back"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#8A8577] hover:bg-[#F0EDE0] hover:text-[#53603E] transition-colors focus-visible:outline-2 focus-visible:outline-[#53603E]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
          <div className="w-8 flex justify-end">
            {showStep && (
              <span className="text-[11px] font-medium text-[#8A8577] tabular-nums">
                {stepIndex}/{TOTAL_QUIZ_STEPS}
              </span>
            )}
          </div>
        </div>
      )}

      {showProgress && stepIndex >= 1 && stepIndex <= TOTAL_QUIZ_STEPS && (
        <ProgressBar percent={progressPercent} />
      )}

      <main className="flex flex-1 flex-col items-center px-5 pt-5 pb-8">
        <div className="w-full max-w-[480px]">
          {children}
        </div>
      </main>
    </div>
  )
}

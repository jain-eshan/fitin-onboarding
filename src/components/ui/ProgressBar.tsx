import { motion } from 'framer-motion'

type ProgressBarProps = {
  percent: number
}

export default function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Onboarding progress: ${percent}%`}
      className="h-[3px] w-full bg-[#E2DCC6]"
    >
      <motion.div
        className="h-full bg-[#53603E] origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: percent / 100 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        style={{ transformOrigin: 'left' }}
      />
    </div>
  )
}

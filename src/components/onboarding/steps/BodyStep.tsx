import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import OptionCard from '../OptionCard'
import Button from '../../ui/Button'

const OPTIONS = [
  { value: 'none',   letter: 'A', label: 'Nothing specific',     sublabel: 'Good to go' },
  { value: 'joints', letter: 'B', label: 'Back or joint issues' },
  { value: 'other',  letter: 'C', label: 'Something else',       sublabel: "I'll type it out" },
]

type BodyStepProps = {
  name?: string
  value: string | null
  onChange: (val: string) => void
  onNext: () => void
}

export default function BodyStep({ value, onChange, onNext }: BodyStepProps) {  // name prop accepted but not used in heading
  const [freeText, setFreeText] = useState('')
  const [localSelection, setLocalSelection] = useState<string | null>(null)

  useEffect(() => {
    if (localSelection === 'none' || localSelection === 'joints') {
      const timer = setTimeout(() => {
        onChange(localSelection === 'none' ? '' : 'Back or joint issues')
        onNext()
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [localSelection, onChange, onNext])

  const handleSelect = (val: string) => {
    setLocalSelection(val)
  }

  const handleOtherContinue = () => {
    onChange(freeText.trim())
    onNext()
  }

  const effectiveValue = localSelection ?? (value !== null ? (value === '' ? 'none' : value === 'Back or joint issues' ? 'joints' : 'other') : null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2
          className="text-[30px] font-semibold tracking-[-0.015em] text-[#241F18] leading-[1.22]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Anything your body needs us to know about?
        </h2>
        <p className="text-[15px] text-[#6E6A5C]">
          Injuries, conditions, or areas to be careful with.
        </p>
      </div>

      <div role="radiogroup" aria-label="Health notes" className="flex flex-col gap-2.5">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            letter={opt.letter}
            label={opt.label}
            sublabel={opt.sublabel}
            selected={effectiveValue === opt.value}
            onSelect={() => handleSelect(opt.value)}
          />
        ))}
      </div>

      <AnimatePresence>
        {effectiveValue === 'other' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden flex flex-col gap-3"
          >
            <textarea
              value={freeText}
              onChange={e => setFreeText(e.target.value)}
              placeholder="Briefly describe what we should know..."
              rows={3}
              aria-label="Health notes details"
              className="w-full rounded-[12px] border border-[#E8E4D4] bg-[#FAFAF5] px-4 py-3 text-[14px] text-[#2D2D2A] placeholder:text-[#B8B3A0] resize-none focus:outline-none focus:border-[#53603E] focus:ring-2 focus:ring-[#53603E]/10 transition-colors"
            />
            <Button onClick={handleOtherContinue} className="w-full">
              Continue
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

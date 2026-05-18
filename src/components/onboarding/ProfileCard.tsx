import { motion, type Variants } from 'framer-motion'
import type { FitnessProfile } from '../../types/onboarding'

const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string) ?? ''

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.06 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

type ProfileCardProps = {
  profile: FitnessProfile
  name: string
}

export default function ProfileCard({ profile, name }: ProfileCardProps) {
  const waMessage = encodeURIComponent(
    `Hi! I just completed my FitIn profile — I'm "${profile.label}". Looking forward to chatting!`
  )
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-col gap-1">
        <p className="text-[13px] text-[#8A8577]">
          Hey {name.split(' ')[0]} 👋
        </p>
        <h2
          className="text-[22px] font-semibold tracking-[-0.02em] text-[#2D2D2A] leading-[1.3]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Here's your fitness profile.
        </h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-[24px] border border-[#E8E4D4] bg-white p-6 shadow-[0_4px_20px_rgba(83,96,62,0.08)]"
      >
        <div
          className="absolute inset-x-0 top-0 h-1 rounded-t-[24px]"
          style={{ background: 'linear-gradient(90deg, #53603E, #FBA327, #6D412A)' }}
          aria-hidden="true"
        />

        <motion.div variants={itemVariants} className="flex items-start justify-between mb-5">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-[14px]"
            style={{ background: 'linear-gradient(135deg, #53603E, #6B7A4E)' }}
            aria-hidden="true"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-[#F5F1DD]">
              <path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 1.62-.49 3.13-1.32 4.39l1.46 1.46A9.94 9.94 0 0022 12c0-5.18-3.95-9.45-9-9.95zM12 20c-4.42 0-8-3.58-8-8 0-3.49 2.24-6.45 5.35-7.52l.65 1.9A6 6 0 006 12c0 3.31 2.69 6 6 6 1.52 0 2.9-.57 3.96-1.5l1.46 1.46A7.96 7.96 0 0112 20zm0-12a4 4 0 100 8 4 4 0 000-8z" fill="currentColor"/>
            </svg>
          </div>
          <span
            className="text-[15px] font-semibold tracking-[-0.02em] text-[#53603E]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            fit in<span className="text-[#FBA327]">.</span> club
          </span>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-5">
          <h3
            className="text-[26px] font-semibold tracking-[-0.02em] text-[#2D2D2A]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {profile.label}
          </h3>
          <p className="text-[13px] text-[#8A8577] mt-1 leading-relaxed">
            {profile.tagline}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2.5 mb-5">
          {[
            { value: profile.idealStart,              label: 'Ideal start' },
            { value: profile.bestWindow,              label: 'Best window' },
            { value: String(profile.goalCount),       label: 'Goals set' },
            { value: profile.recommendedProgramLabel, label: 'Recommended' },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-[13px] border border-[#F0EDE0] bg-[#FAFAF5] p-3"
            >
              <p className="text-[18px] font-bold text-[#53603E] leading-none">{stat.value}</p>
              <p className="text-[11px] text-[#8A8577] uppercase tracking-wide mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-[12px] border-l-[3px] border-[#FBA327] bg-[#FFF9F0] px-4 py-3"
        >
          <p className="text-[13px] text-[#6D412A] leading-relaxed">
            Based on your profile, we recommend starting with the{' '}
            <strong className="text-[#53603E]">{profile.recommendedProgramLabel}</strong> —
            short guided sessions that fit into your schedule with a trainer who keeps you going.
          </p>
        </motion.div>
      </motion.div>

      <div className="flex flex-col gap-3">
        <a
          href="#"
          onClick={e => {
            e.preventDefault()
            alert('Calendly integration goes here')
          }}
          className="flex h-12 w-full items-center justify-center rounded-[14px] bg-[#53603E] text-[14px] font-semibold text-[#F5F1DD] transition-colors hover:bg-[#475435] active:scale-[0.97]"
        >
          Book my intro call
        </a>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-full items-center justify-center rounded-[14px] border border-[#E8E4D4] text-[14px] font-semibold text-[#53603E] transition-colors hover:border-[#53603E] hover:bg-[#F5F3E8] active:scale-[0.97]"
        >
          Message us on WhatsApp
        </a>
        <p className="text-center text-[12px] text-[#B8B3A0]">
          or{' '}
          <button
            onClick={() => {
              alert('Account creation goes here')
            }}
            className="underline underline-offset-2 hover:text-[#53603E] transition-colors"
          >
            create an account to save your profile
          </button>
        </p>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { useOnboarding } from '../../hooks/useOnboarding'
import { computeProfile } from '../../lib/profile-logic'
import { submitOnboardingLead } from '../../lib/supabase'
import type { ContactFormData } from '../../types/onboarding'

import StepLayout from './StepLayout'
import WelcomeStep from './steps/WelcomeStep'
import RoutineStep from './steps/RoutineStep'
import GoalsStep from './steps/GoalsStep'
import BarriersStep from './steps/BarriersStep'
import ScheduleStep from './steps/ScheduleStep'
import DietStep from './steps/DietStep'
import BodyStep from './steps/BodyStep'
import ContactStep from './steps/ContactStep'
import ProfileCard from './ProfileCard'

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

export default function OnboardingFlow() {
  const {
    currentStep,
    stepIndex,
    direction,
    answers,
    goNext,
    goBack,
    updateAnswer,
    toggleArrayAnswer,
    progressPercent,
  } = useOnboarding()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [contactData, setContactData] = useState<ContactFormData | null>(null)

  const handleContactSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    const profile = computeProfile(answers)

    try {
      await submitOnboardingLead({
        name: data.name,
        phone: data.phone,
        email: data.email ?? undefined,
        age: data.age,
        city: data.city,
        activity_level: answers.activityLevel,
        goals: answers.goals,
        barriers: answers.barriers,
        preferred_time: answers.preferredTime,
        diet_awareness: answers.dietAwareness,
        health_notes: answers.healthNotes,
        profile_type: profile.type,
        recommended_program: profile.recommendedProgram,
        source: 'website',
      })
      setContactData(data)
      goNext()
    } catch (err) {
      console.error(err)
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const profile = contactData ? computeProfile(answers) : null

  return (
    <StepLayout
      stepIndex={stepIndex}
      progressPercent={progressPercent}
      onBack={stepIndex > 0 && currentStep !== 'profile' ? goBack : undefined}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {currentStep === 'welcome' && (
            <WelcomeStep onNext={goNext} />
          )}
          {currentStep === 'routine' && (
            <RoutineStep
              value={answers.activityLevel}
              onChange={val => updateAnswer('activityLevel', val)}
              onNext={goNext}
            />
          )}
          {currentStep === 'goals' && (
            <GoalsStep
              value={answers.goals}
              onToggle={val => toggleArrayAnswer('goals', val)}
              onNext={goNext}
            />
          )}
          {currentStep === 'barriers' && (
            <BarriersStep
              value={answers.barriers}
              onToggle={val => toggleArrayAnswer('barriers', val)}
              onNext={goNext}
            />
          )}
          {currentStep === 'schedule' && (
            <ScheduleStep
              value={answers.preferredTime}
              onChange={val => updateAnswer('preferredTime', val)}
              onNext={goNext}
            />
          )}
          {currentStep === 'diet' && (
            <DietStep
              value={answers.dietAwareness}
              onChange={val => updateAnswer('dietAwareness', val)}
              onNext={goNext}
            />
          )}
          {currentStep === 'body' && (
            <BodyStep
              value={answers.healthNotes}
              onChange={val => updateAnswer('healthNotes', val)}
              onNext={goNext}
            />
          )}
          {currentStep === 'contact' && (
            <>
              <ContactStep onSubmit={handleContactSubmit} isSubmitting={isSubmitting} />
              {submitError && (
                <p className="mt-3 text-center text-[13px] text-[#DC2626]" role="alert">
                  {submitError}
                </p>
              )}
            </>
          )}
          {currentStep === 'profile' && profile && contactData && (
            <ProfileCard profile={profile} name={contactData.name} />
          )}
        </motion.div>
      </AnimatePresence>
    </StepLayout>
  )
}

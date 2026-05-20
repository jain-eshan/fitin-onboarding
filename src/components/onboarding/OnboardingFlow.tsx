import { useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { useOnboarding } from '../../hooks/useOnboarding'
import { computeProfile } from '../../lib/profile-logic'
import { submitOnboardingLead } from '../../lib/supabase'
import { notifySubmission } from '../../lib/notifications'
import type { BasicsFormData, ContactFormData } from '../../types/onboarding'

import StepLayout from './StepLayout'
import IntroStep from './steps/IntroStep'
import BasicsStep from './steps/BasicsStep'
import GoalsStep from './steps/GoalsStep'
import RoutineStep from './steps/RoutineStep'
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
    updateAnswers,
    toggleArrayAnswer,
    progressPercent,
  } = useOnboarding()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleBasicsSubmit = (data: BasicsFormData) => {
    updateAnswers({ name: data.name, age: data.age })
    goNext()
  }

  const handleContactSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    // Merge contact data into answers before computing profile
    const fullAnswers = { ...answers, ...data }
    updateAnswers({ phone: data.phone, city: data.city, email: data.email ?? '' })

    const profile = computeProfile(fullAnswers)

    const leadPayload = {
      name: fullAnswers.name,
      phone: data.phone,
      email: data.email || undefined,
      age: fullAnswers.age,
      city: data.city,
      activity_level: fullAnswers.activityLevel,
      goals: fullAnswers.goals,
      barriers: fullAnswers.barriers,
      preferred_time: fullAnswers.preferredTime,
      diet_awareness: fullAnswers.dietAwareness,
      health_notes: fullAnswers.healthNotes,
      profile_type: profile.type,
      recommended_program: profile.recommendedProgram,
      source: 'website',
    }

    try {
      await submitOnboardingLead(leadPayload)
      // Non-blocking notification
      notifySubmission({
        name: fullAnswers.name,
        age: fullAnswers.age,
        phone: data.phone,
        city: data.city,
        email: data.email ?? '',
        activity_level: fullAnswers.activityLevel,
        goals: fullAnswers.goals,
        barriers: fullAnswers.barriers,
        preferred_time: fullAnswers.preferredTime,
        diet_awareness: fullAnswers.dietAwareness,
        health_notes: fullAnswers.healthNotes,
        profile_type: profile.type,
        recommended_program: profile.recommendedProgram,
      })
      goNext()
    } catch (err) {
      console.error(err)
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const profile = currentStep === 'profile' ? computeProfile(answers) : null

  const canGoBack = stepIndex > 0 && currentStep !== 'profile' && currentStep !== 'intro'

  return (
    <StepLayout
      stepIndex={stepIndex}
      progressPercent={progressPercent}
      onBack={canGoBack ? goBack : undefined}
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
          {currentStep === 'intro' && (
            <IntroStep onNext={goNext} />
          )}
          {currentStep === 'basics' && (
            <BasicsStep
              defaultName={answers.name}
              defaultAge={answers.age}
              onSubmit={handleBasicsSubmit}
            />
          )}
          {currentStep === 'goals' && (
            <GoalsStep
              name={answers.name}
              value={answers.goals}
              onToggle={val => toggleArrayAnswer('goals', val)}
              onNext={goNext}
            />
          )}
          {currentStep === 'routine' && (
            <RoutineStep
              name={answers.name}
              value={answers.activityLevel}
              onChange={val => updateAnswer('activityLevel', val)}
              onNext={goNext}
            />
          )}
          {currentStep === 'barriers' && (
            <BarriersStep
              name={answers.name}
              value={answers.barriers}
              onToggle={val => toggleArrayAnswer('barriers', val)}
              onNext={goNext}
            />
          )}
          {currentStep === 'schedule' && (
            <ScheduleStep
              name={answers.name}
              value={answers.preferredTime}
              onChange={val => updateAnswer('preferredTime', val)}
              onNext={goNext}
            />
          )}
          {currentStep === 'diet' && (
            <DietStep
              name={answers.name}
              value={answers.dietAwareness}
              onChange={val => updateAnswer('dietAwareness', val)}
              onNext={goNext}
            />
          )}
          {currentStep === 'body' && (
            <BodyStep
              name={answers.name}
              value={answers.healthNotes}
              onChange={val => updateAnswer('healthNotes', val)}
              onNext={goNext}
            />
          )}
          {currentStep === 'contact' && (
            <div className="flex flex-col gap-3">
              <ContactStep
                name={answers.name}
                defaultPhone={answers.phone}
                defaultCity={answers.city}
                defaultEmail={answers.email}
                onSubmit={handleContactSubmit}
                isSubmitting={isSubmitting}
              />
              {submitError && (
                <p className="text-center text-[13px] text-[#DC2626]" role="alert">
                  {submitError}
                </p>
              )}
            </div>
          )}
          {currentStep === 'profile' && profile && (
            <ProfileCard profile={profile} name={answers.name} />
          )}
        </motion.div>
      </AnimatePresence>
    </StepLayout>
  )
}

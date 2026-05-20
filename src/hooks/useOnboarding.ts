import { useState, useCallback } from 'react'
import { type OnboardingAnswers, defaultAnswers, STEPS, type StepId } from '../types/onboarding'

const SESSION_KEY = 'fitin_onboarding'

function loadFromSession(): { stepIndex: number; answers: OnboardingAnswers } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveToSession(stepIndex: number, answers: OnboardingAnswers) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ stepIndex, answers }))
  } catch {}
}

export function useOnboarding() {
  const saved = typeof window !== 'undefined' ? loadFromSession() : null
  const [stepIndex, setStepIndex] = useState(saved?.stepIndex ?? 0)
  const [answers, setAnswers] = useState<OnboardingAnswers>(saved?.answers ?? defaultAnswers)
  const [direction, setDirection] = useState<1 | -1>(1)

  const currentStep: StepId = STEPS[stepIndex]

  const goNext = useCallback(() => {
    setDirection(1)
    setStepIndex(i => {
      const next = Math.min(i + 1, STEPS.length - 1)
      saveToSession(next, answers)
      return next
    })
  }, [answers])

  const goBack = useCallback(() => {
    setDirection(-1)
    setStepIndex(i => {
      const prev = Math.max(i - 1, 0)
      saveToSession(prev, answers)
      return prev
    })
  }, [answers])

  const updateAnswer = useCallback(
    <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => {
      setAnswers(prev => {
        const next = { ...prev, [key]: value }
        saveToSession(stepIndex, next)
        return next
      })
    },
    [stepIndex]
  )

  const updateAnswers = useCallback(
    (updates: Partial<OnboardingAnswers>) => {
      setAnswers(prev => {
        const next = { ...prev, ...updates }
        saveToSession(stepIndex, next)
        return next
      })
    },
    [stepIndex]
  )

  const toggleArrayAnswer = useCallback(
    (key: 'goals' | 'barriers', value: string) => {
      setAnswers(prev => {
        const current = prev[key]
        const next = current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value]
        const updated = { ...prev, [key]: next }
        saveToSession(stepIndex, updated)
        return updated
      })
    },
    [stepIndex]
  )

  const reset = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setStepIndex(0)
    setAnswers(defaultAnswers)
    setDirection(1)
  }, [])

  // stepIndex 0 = intro (no progress), 1-8 = quiz steps, 9 = profile
  const progressPercent =
    stepIndex === 0 ? 0
    : stepIndex >= 9 ? 100
    : Math.round((stepIndex / 8) * 100)

  return {
    currentStep,
    stepIndex,
    direction,
    answers,
    goNext,
    goBack,
    updateAnswer,
    updateAnswers,
    toggleArrayAnswer,
    reset,
    progressPercent,
    isFirst: stepIndex === 0,
    isProfile: currentStep === 'profile',
  }
}

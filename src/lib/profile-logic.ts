import type { OnboardingAnswers, FitnessProfile } from '../types/onboarding'

const PROGRAM_LABELS: Record<string, string> = {
  habit_builder: '21-Day Habit Builder',
  momentum_cohort: 'Build Momentum',
  thrive_1on1: 'Fitin Thrive 1:1',
}

export function computeProfile(answers: OnboardingAnswers): FitnessProfile {
  const { activityLevel, goals, barriers, preferredTime } = answers

  const isActive = activityLevel === 'active'
  const isOnOff = activityLevel === 'on_and_off'
  const noTime = barriers.includes('no_time')
  const losesSteam = barriers.includes('start_stop')
  const wantStrength = goals.includes('strength') || goals.includes('weight')

  let type: string
  let label: string
  let tagline: string
  let recommendedProgram: string

  if (isActive && wantStrength) {
    type = 'leveler'
    label = 'The Leveler'
    tagline = "You've got the base. Let's take it up a notch."
    recommendedProgram = 'momentum_cohort'
  } else if (noTime) {
    type = 'time_cruncher'
    label = 'The Time-Cruncher'
    tagline = "Your schedule is packed. We'll make 15 minutes count."
    recommendedProgram = 'habit_builder'
  } else if (isOnOff && losesSteam) {
    type = 'restarter'
    label = 'The Restarter'
    tagline = "You've been here before. This time, we'll make it stick."
    recommendedProgram = 'habit_builder'
  } else {
    type = 'starter'
    label = 'The Starter'
    tagline = "You're at the beginning — and that's exactly the right place."
    recommendedProgram = 'habit_builder'
  }

  const timeLabels: Record<string, string> = {
    early_morning: 'Early AM',
    morning: 'AM',
    evening: 'PM',
    flexible: 'Flexible',
  }

  return {
    type,
    label,
    tagline,
    idealStart: '15 min',
    bestWindow: preferredTime ? timeLabels[preferredTime] ?? 'Flexible' : 'Flexible',
    goalCount: goals.length,
    recommendedProgram,
    recommendedProgramLabel: PROGRAM_LABELS[recommendedProgram] ?? '21-Day Habit Builder',
  }
}

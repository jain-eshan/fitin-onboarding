import { z } from 'zod'

export const ActivityLevel = {
  INACTIVE: 'inactive',
  ON_AND_OFF: 'on_and_off',
  ACTIVE: 'active',
} as const

export const PreferredTime = {
  EARLY_MORNING: 'early_morning',
  MORNING: 'morning',
  EVENING: 'evening',
  FLEXIBLE: 'flexible',
} as const

export const DietAwareness = {
  UNAWARE: 'unaware',
  TRYING: 'trying',
  MINDFUL: 'mindful',
} as const

export const ProfileType = {
  STARTER: 'starter',
  RESTARTER: 'restarter',
  TIME_CRUNCHER: 'time_cruncher',
  LEVELER: 'leveler',
} as const

export type OnboardingAnswers = {
  // Collected in basics step (step 1)
  name: string
  age: number | null
  // Quiz answers
  activityLevel: string | null
  goals: string[]
  barriers: string[]
  preferredTime: string | null
  dietAwareness: string | null
  healthNotes: string | null
  // Collected in contact step (step 8)
  phone: string
  city: string
  email: string
}

export const defaultAnswers: OnboardingAnswers = {
  name: '',
  age: null,
  activityLevel: null,
  goals: [],
  barriers: [],
  preferredTime: null,
  dietAwareness: null,
  healthNotes: null,
  phone: '',
  city: '',
  email: '',
}

// Basics step schema (name + age)
export const BasicsSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  age: z
    .number({ invalid_type_error: 'Enter your age' } as never)
    .int()
    .min(16, 'Must be at least 16')
    .max(80, 'Must be 80 or younger'),
})

export type BasicsFormData = z.infer<typeof BasicsSchema>

// Contact step schema (phone + city + email)
export const ContactSchema = z.object({
  phone: z
    .string()
    .min(10, 'Enter a valid WhatsApp number')
    .regex(/^[0-9+\s\-()]{10,15}$/, 'Enter a valid phone number'),
  city: z.string().min(2, 'Enter your city'),
  email: z.string().email('Enter a valid email'),
})

export type ContactFormData = z.infer<typeof ContactSchema>

export type OnboardingLead = {
  name: string
  age: number | null
  phone: string
  city: string
  email?: string
  activityLevel: string | null
  goals: string[]
  barriers: string[]
  preferredTime: string | null
  dietAwareness: string | null
  healthNotes: string | null
  profileType: string
  recommendedProgram: string
  source: string
}

export type FitnessProfile = {
  type: string
  label: string
  tagline: string
  idealStart: string
  bestWindow: string
  goalCount: number
  recommendedProgram: string
  recommendedProgramLabel: string
}

export type StepId =
  | 'intro'
  | 'basics'
  | 'goals'
  | 'routine'
  | 'barriers'
  | 'schedule'
  | 'diet'
  | 'body'
  | 'contact'
  | 'profile'

export const STEPS: StepId[] = [
  'intro',
  'basics',
  'goals',
  'routine',
  'barriers',
  'schedule',
  'diet',
  'body',
  'contact',
  'profile',
]

export const TOTAL_QUIZ_STEPS = 8

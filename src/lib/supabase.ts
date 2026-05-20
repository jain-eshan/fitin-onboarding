import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key'
)

export async function submitOnboardingLead(lead: {
  name: string
  phone: string
  email?: string
  age: number | null
  city: string
  activity_level: string | null
  goals: string[]
  barriers: string[]
  preferred_time: string | null
  diet_awareness: string | null
  health_notes: string | null
  profile_type: string
  recommended_program: string
  source: string
}) {
  const { data, error } = await supabase
    .from('onboarding_leads')
    .insert([lead])
    .select('id')
    .single()

  if (error) throw error
  return data
}

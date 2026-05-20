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

export async function bookSlot(booking: {
  lead_name: string
  lead_email: string
  trainer_name: string
  slot_date: string   // "2026-05-22"
  slot_start: string  // "10:00"
  slot_end: string    // "10:30"
}) {
  const { data, error } = await supabase
    .from('onboarding_bookings')
    .insert([{
      lead_name: booking.lead_name,
      lead_email: booking.lead_email,
      trainer_name: booking.trainer_name,
      slot_date: booking.slot_date,
      slot_start: booking.slot_start,
      slot_end: booking.slot_end,
      status: 'confirmed',
    }])
    .select('id')
    .single()

  if (error) {
    // Check for unique constraint violation (slot already taken)
    if (error.code === '23505') throw new Error('SLOT_TAKEN')
    throw error
  }
  return data
}

export async function getBookedSlots(trainerName: string, slotDate: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('onboarding_bookings')
    .select('slot_start')
    .eq('trainer_name', trainerName)
    .eq('slot_date', slotDate)
    .eq('status', 'confirmed')

  if (error) {
    console.warn('Failed to fetch booked slots:', error)
    return []
  }
  return (data ?? []).map((r: { slot_start: string }) => r.slot_start)
}

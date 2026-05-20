/**
 * Sends onboarding lead data to an external webhook (Google Apps Script, Make, n8n, etc.)
 * Set VITE_NOTIFY_WEBHOOK_URL in Vercel env vars to enable notifications.
 */
export async function notifySubmission(lead: {
  name: string
  age: number | null
  phone: string
  city: string
  email: string
  activity_level: string | null
  goals: string[]
  barriers: string[]
  preferred_time: string | null
  diet_awareness: string | null
  health_notes: string | null
  profile_type: string
  recommended_program: string
}) {
  const webhookUrl = import.meta.env.VITE_NOTIFY_WEBHOOK_URL as string | undefined
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...lead,
        submitted_at: new Date().toISOString(),
        source: 'fitin.club/onboarding',
      }),
    })
  } catch (err) {
    // Notification failure is non-blocking — don't throw
    console.warn('Notification webhook failed:', err)
  }
}

export async function notifyBooking(booking: {
  lead_name: string
  lead_email: string
  trainer_name: string
  slot_date: string
  slot_start: string
  slot_end: string
}) {
  const webhookUrl = import.meta.env.VITE_NOTIFY_WEBHOOK_URL as string | undefined
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'booking',
        ...booking,
        booked_at: new Date().toISOString(),
      }),
    })
  } catch (err) {
    console.warn('Booking notification failed:', err)
  }
}

// ============================================================
// FitIn Onboarding — Google Apps Script Notification Handler
// ============================================================
// SETUP (MUST run from fitindotclub@gmail.com):
// 1. Log into fitindotclub@gmail.com in your browser
// 2. Go to script.google.com → New project
// 3. Paste this entire file
// 4. Update SHEET_ID below (create a Sheet in FitIn's Drive, copy ID from URL)
// 5. CALENDAR_ID is already set to fitindotclub@gmail.com
// 6. Update trainer emails if different
// 7. Deploy → New deployment → Web app
//    - Execute as: Me (fitindotclub@gmail.com)  ← CRITICAL
//    - Who has access: Anyone
// 8. Copy the Web App URL → add to Vercel as VITE_NOTIFY_WEBHOOK_URL → Redeploy
// ============================================================

const SHEET_ID               = 'YOUR_GOOGLE_SHEET_ID'
const CALENDAR_ID            = 'fitindotclub@gmail.com'
const TRAINER_HARSHITA_EMAIL = 'harshita@fitin.club'
const TRAINER_ISHU_EMAIL     = 'ishu@fitin.club'
const FOUNDER_EMAIL          = 'eshan@fitin.club'

const TRAINER_EMAILS = {
  'Harshita': TRAINER_HARSHITA_EMAIL,
  'Ishu':     TRAINER_ISHU_EMAIL,
}

// ─── Entry point ─────────────────────────────────────────────

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)

    if (data.type === 'booking') {
      handleBooking(data)
    } else {
      handleOnboardingSubmission(data)
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

// ─── Booking handler ─────────────────────────────────────────

function handleBooking(data) {
  createBookingCalendarEvent(data)
  sendBookingEmails(data)
  appendBookingToSheet(data)
}

function createBookingCalendarEvent(data) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID)

  // Parse date + times — slot_date: "2026-05-22", slot_start: "10:00", slot_end: "10:30"
  const [year, month, day]    = data.slot_date.split('-').map(Number)
  const [startHour, startMin] = data.slot_start.split(':').map(Number)
  const [endHour, endMin]     = data.slot_end.split(':').map(Number)

  const startDate = new Date(year, month - 1, day, startHour, startMin, 0)
  const endDate   = new Date(year, month - 1, day, endHour,   endMin,   0)

  const trainerEmail = TRAINER_EMAILS[data.trainer_name] || TRAINER_HARSHITA_EMAIL
  const guests = [trainerEmail]
  if (data.lead_email) guests.push(data.lead_email)

  calendar.createEvent(
    `FitIn Intro Call — ${data.lead_name} & ${data.trainer_name}`,
    startDate,
    endDate,
    {
      description: [
        '🏋️ FitIn Club — Free Intro Call',
        '',
        `Guest: ${data.lead_name}`,
        `Trainer: ${data.trainer_name}`,
        '',
        "This is your complimentary intro session with FitIn Club.",
        "We'll understand your goals and figure out the best way to get you started.",
        '',
        'Questions? WhatsApp us at +91 87005 09361',
      ].join('\n'),
      guests: guests.join(','),
      sendInvites: true,
    }
  )
}

function sendBookingEmails(data) {
  const trainerEmail = TRAINER_EMAILS[data.trainer_name] || TRAINER_HARSHITA_EMAIL
  const slotDisplay  = formatSlot(data.slot_date, data.slot_start, data.slot_end)
  const firstName    = data.lead_name.split(' ')[0]

  // To trainer
  MailApp.sendEmail(
    trainerEmail,
    `📅 New Intro Call Booked — ${data.lead_name}`,
    `Hi ${data.trainer_name},\n\nA new intro call has been booked.\n\nClient: ${data.lead_name}\nSlot: ${slotDisplay}\nEmail: ${data.lead_email || 'Not provided'}\n\nThe calendar invite has been added to the FitIn calendar.\n\nFitIn Club`
  )

  // To founder
  MailApp.sendEmail(
    FOUNDER_EMAIL,
    `📅 Intro Call Booked — ${data.lead_name} with ${data.trainer_name}`,
    `New intro call booked.\n\nClient: ${data.lead_name}\nTrainer: ${data.trainer_name}\nSlot: ${slotDisplay}\nEmail: ${data.lead_email || 'Not provided'}\n\nFitIn Club`
  )

  // Confirmation to user
  if (data.lead_email) {
    MailApp.sendEmail(
      data.lead_email,
      `Your FitIn Intro Call is Confirmed, ${firstName}! 🎉`,
      [
        `Hi ${firstName},`,
        '',
        'Your intro call with FitIn Club is confirmed!',
        '',
        `📅 ${slotDisplay}`,
        `👤 Trainer: ${data.trainer_name}`,
        '',
        "You'll receive a Google Calendar invite at this email shortly.",
        '',
        "On the call, we'll chat about your fitness goals and figure out the best way to get you started. No pressure, no commitment — just a friendly conversation.",
        '',
        'If you need to reschedule, WhatsApp us at +91 87005 09361.',
        '',
        'See you soon!',
        'The FitIn Team',
        'fitin.club',
      ].join('\n')
    )
  }
}

function appendBookingToSheet(data) {
  const ss    = SpreadsheetApp.openById(SHEET_ID)
  const sheet = ss.getSheetByName('Bookings') || ss.insertSheet('Bookings')

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Booked At', 'Name', 'Email', 'Trainer', 'Date', 'Start', 'End'])
  }

  sheet.appendRow([
    new Date().toISOString(),
    data.lead_name,
    data.lead_email || '',
    data.trainer_name,
    data.slot_date,
    data.slot_start,
    data.slot_end,
  ])
}

// ─── Onboarding submission handler ───────────────────────────

function handleOnboardingSubmission(data) {
  appendLeadToSheet(data)
  sendLeadEmails(data)
  createFollowUpReminder(data)
}

function appendLeadToSheet(data) {
  const ss    = SpreadsheetApp.openById(SHEET_ID)
  const sheet = ss.getSheetByName('Leads') || ss.insertSheet('Leads')

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Submitted At', 'Name', 'Age', 'Phone', 'City', 'Email',
      'Activity Level', 'Goals', 'Barriers', 'Preferred Time',
      'Diet Awareness', 'Health Notes', 'Profile Type', 'Recommended Program',
    ])
  }

  sheet.appendRow([
    data.submitted_at || new Date().toISOString(),
    data.name,
    data.age,
    data.phone,
    data.city,
    data.email || '',
    data.activity_level || '',
    (data.goals    || []).join(', '),
    (data.barriers || []).join(', '),
    data.preferred_time   || '',
    data.diet_awareness   || '',
    data.health_notes     || '',
    data.profile_type,
    data.recommended_program,
  ])
}

function sendLeadEmails(data) {
  const subject = `🏋️ New FitIn Lead: ${data.name} (${data.profile_type})`
  const body = `
New onboarding submission from ${data.name}

Profile Type: ${data.profile_type}
Recommended Program: ${data.recommended_program}

CONTACT
Name: ${data.name}
Age: ${data.age}
Phone: ${data.phone}
City: ${data.city}
Email: ${data.email || 'Not provided'}

QUIZ ANSWERS
Activity Level: ${data.activity_level}
Goals: ${(data.goals    || []).join(', ')}
Barriers: ${(data.barriers || []).join(', ')}
Preferred Time: ${data.preferred_time}
Diet: ${data.diet_awareness}
Health Notes: ${data.health_notes || 'None'}

Submitted: ${data.submitted_at || new Date().toISOString()}
  `.trim()

  MailApp.sendEmail(TRAINER_HARSHITA_EMAIL, subject, body)
  MailApp.sendEmail(TRAINER_ISHU_EMAIL,     subject, body)
  MailApp.sendEmail(FOUNDER_EMAIL,          subject, body)

  if (data.email) {
    const firstName = data.name.split(' ')[0]
    MailApp.sendEmail(
      data.email,
      `Your FitIn Fitness Profile is Ready, ${firstName}!`,
      [
        `Hi ${firstName},`,
        '',
        'Thanks for completing your FitIn profile!',
        '',
        `Your Profile: ${data.profile_type}`,
        `Recommended Program: ${data.recommended_program}`,
        '',
        `Our trainer will reach out on WhatsApp (${data.phone}) within 24 hours to set up your free intro call.`,
        '',
        'Looking forward to working with you!',
        'The FitIn Team',
        'fitin.club',
      ].join('\n')
    )
  }
}

function createFollowUpReminder(data) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID)
  const followUp = new Date()
  followUp.setDate(followUp.getDate() + 1)
  followUp.setHours(10, 0, 0, 0)
  if (followUp.getDay() === 0) followUp.setDate(followUp.getDate() + 1)
  if (followUp.getDay() === 6) followUp.setDate(followUp.getDate() + 2)

  const endTime = new Date(followUp)
  endTime.setMinutes(endTime.getMinutes() + 30)

  calendar.createEvent(
    `Follow up with ${data.name} (${data.profile_type})`,
    followUp,
    endTime,
    {
      description: `New FitIn lead\n\nPhone: ${data.phone}\nCity: ${data.city}\nProfile: ${data.profile_type}\nProgram: ${data.recommended_program}\n\nGoals: ${(data.goals || []).join(', ')}\nBarriers: ${(data.barriers || []).join(', ')}`,
      guests: TRAINER_HARSHITA_EMAIL,
    }
  )
}

// ─── Helper ──────────────────────────────────────────────────

function formatSlot(slotDate, slotStart, slotEnd) {
  const [year, month, day] = slotDate.split('-').map(Number)
  const date    = new Date(year, month - 1, day)
  const dateStr = date.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const fmt = (t) => {
    const [h, m] = t.split(':').map(Number)
    const ampm   = h >= 12 ? 'pm' : 'am'
    const hour   = h % 12 || 12
    return `${hour}:${String(m).padStart(2, '0')}${ampm}`
  }

  return `${dateStr}, ${fmt(slotStart)} – ${fmt(slotEnd)} IST`
}

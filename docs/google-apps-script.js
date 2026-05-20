// ============================================================
// FitIn Onboarding — Google Apps Script Notification Handler
// ============================================================
// SETUP:
// 1. Go to script.google.com → New project
// 2. Paste this entire file
// 3. Create a Google Sheet and copy its ID from the URL
// 4. Create a Google Calendar (or use existing) and copy its ID
// 5. Update SHEET_ID, CALENDAR_ID, TRAINER_EMAIL, FOUNDER_EMAIL below
// 6. Deploy → New deployment → Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 7. Copy the Web App URL and add it to Vercel as VITE_NOTIFY_WEBHOOK_URL
// ============================================================

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'
const CALENDAR_ID = 'YOUR_GOOGLE_CALENDAR_ID'
const TRAINER_EMAIL = 'trainer@fitin.club'
const FOUNDER_EMAIL = 'eshan@fitin.club'

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    appendToSheet(data)
    sendEmailNotifications(data)
    createCalendarReminder(data)
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function appendToSheet(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

  // Add header row if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Submitted At', 'Name', 'Age', 'Phone', 'City', 'Email',
      'Activity Level', 'Goals', 'Barriers', 'Preferred Time',
      'Diet Awareness', 'Health Notes', 'Profile Type', 'Recommended Program'
    ])
  }

  sheet.appendRow([
    data.submitted_at,
    data.name,
    data.age,
    data.phone,
    data.city,
    data.email || '',
    data.activity_level || '',
    (data.goals || []).join(', '),
    (data.barriers || []).join(', '),
    data.preferred_time || '',
    data.diet_awareness || '',
    data.health_notes || '',
    data.profile_type,
    data.recommended_program,
  ])
}

function sendEmailNotifications(data) {
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
Goals: ${(data.goals || []).join(', ')}
Barriers: ${(data.barriers || []).join(', ')}
Preferred Time: ${data.preferred_time}
Diet: ${data.diet_awareness}
Health Notes: ${data.health_notes || 'None'}

Submitted: ${data.submitted_at}
Source: ${data.source}
  `.trim()

  MailApp.sendEmail(TRAINER_EMAIL, subject, body)
  MailApp.sendEmail(FOUNDER_EMAIL, subject, body)

  // Send confirmation to user if email provided
  if (data.email) {
    MailApp.sendEmail(
      data.email,
      `Your FitIn Fitness Profile is Ready, ${data.name.split(' ')[0]}!`,
      `Hi ${data.name.split(' ')[0]},\n\nThanks for completing your FitIn profile!\n\nYour Profile Type: ${data.profile_type}\nRecommended Program: ${data.recommended_program}\n\nOur trainer will reach out on WhatsApp (${data.phone}) within 24 hours to set up your free intro call.\n\nLooking forward to working with you!\n\nThe FitIn Team\nfitin.club`
    )
  }
}

function createCalendarReminder(data) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID)
  
  // Create a follow-up reminder for the trainer — next business day at 10am
  const followUpDate = new Date()
  followUpDate.setDate(followUpDate.getDate() + 1)
  followUpDate.setHours(10, 0, 0, 0)
  // Skip weekends
  if (followUpDate.getDay() === 0) followUpDate.setDate(followUpDate.getDate() + 1)
  if (followUpDate.getDay() === 6) followUpDate.setDate(followUpDate.getDate() + 2)

  const endDate = new Date(followUpDate)
  endDate.setMinutes(endDate.getMinutes() + 30)

  calendar.createEvent(
    `Follow up with ${data.name} (${data.profile_type})`,
    followUpDate,
    endDate,
    {
      description: `New FitIn lead follow-up\n\nPhone: ${data.phone}\nCity: ${data.city}\nProfile: ${data.profile_type}\nProgram: ${data.recommended_program}\n\nGoals: ${(data.goals || []).join(', ')}\nBarriers: ${(data.barriers || []).join(', ')}`,
      guests: TRAINER_EMAIL,
    }
  )
}

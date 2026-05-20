import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { bookSlot, getBookedSlots } from '../../lib/supabase'
import { notifyBooking } from '../../lib/notifications'

// ---------------------------------------------------------------------------
// Trainer availability config
// ---------------------------------------------------------------------------

type SlotDef = {
  start: string
  end: string
  days: number[] // 0=Sun, 1=Mon … 6=Sat
}

type TrainerDef = {
  name: string
  color: string
  slots: SlotDef[]
}

const TRAINERS: TrainerDef[] = [
  {
    name: 'Harshita',
    color: '#53603E',
    slots: [
      { start: '07:20', end: '07:50', days: [0,1,2,3,4,5,6] },
      { start: '07:50', end: '08:20', days: [0,1,2,3,4,5,6] },
      { start: '14:20', end: '14:50', days: [0,1,2,3,4,5,6] },
      { start: '14:50', end: '15:20', days: [0,1,2,3,4,5,6] },
      { start: '15:20', end: '15:50', days: [0,1,2,3,4,5,6] },
      { start: '21:00', end: '21:30', days: [0,1,2,3,4,5,6] },
      { start: '21:30', end: '22:00', days: [0,1,2,3,4,5,6] },
      { start: '22:00', end: '22:30', days: [0,1,2,3,4,5,6] },
      { start: '22:30', end: '23:00', days: [0,1,2,3,4,5,6] },
    ],
  },
  {
    name: 'Ishu',
    color: '#6D412A',
    slots: [
      { start: '07:00', end: '07:30', days: [2,4,5] },
      { start: '10:00', end: '10:30', days: [0,1,2,3,4,5,6] },
      { start: '10:30', end: '11:00', days: [0,1,2,3,4,5,6] },
      { start: '11:00', end: '11:30', days: [0,1,2,3,4,5,6] },
      { start: '11:30', end: '12:00', days: [0,1,2,3,4,5,6] },
      { start: '12:00', end: '12:30', days: [0,1,2,3,4,5,6] },
      { start: '12:30', end: '13:00', days: [0,1,2,3,4,5,6] },
      { start: '13:00', end: '13:30', days: [0,1,2,3,4,5,6] },
      { start: '13:30', end: '14:00', days: [0,1,2,3,4,5,6] },
      { start: '14:00', end: '14:30', days: [0,1,2,3,4,5,6] },
      { start: '14:30', end: '15:00', days: [0,1,2,3,4,5,6] },
      { start: '15:00', end: '15:30', days: [0,1,2,3,4,5,6] },
      { start: '15:30', end: '16:00', days: [0,1,2,3,4,5,6] },
      { start: '16:00', end: '16:30', days: [0,1,2,3,4,5,6] },
      { start: '16:30', end: '17:00', days: [0,1,2,3,4,5,6] },
      { start: '17:00', end: '17:30', days: [0,1,2,3,4,5,6] },
      { start: '17:30', end: '18:00', days: [0,1,2,3,4,5,6] },
    ],
  },
]

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BookingResult = {
  trainerName: string
  date: string       // "2026-05-22"
  startTime: string  // "10:00"
  endTime: string    // "10:30"
}

type SelectedSlot = {
  trainerName: string
  start: string
  end: string
}

type CalendarPickerProps = {
  leadName: string
  leadEmail: string
  onBooked: (booking: BookingResult) => void
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDisplayTime(t: string): string {
  const [hStr, mStr] = t.split(':')
  let h = parseInt(hStr, 10)
  const m = mStr
  const ampm = h >= 12 ? 'pm' : 'am'
  if (h > 12) h -= 12
  if (h === 0) h = 12
  return `${h}:${m}${ampm}`
}

function get7Days(): Date[] {
  const days: Date[] = []
  const today = new Date()
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d)
  }
  return days
}

// ---------------------------------------------------------------------------
// CalendarPicker component
// ---------------------------------------------------------------------------

export default function CalendarPicker({ leadName, leadEmail, onBooked }: CalendarPickerProps) {
  const days = get7Days()

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null)
  const [bookedMap, setBookedMap] = useState<Record<string, string[]>>({}) // trainerName -> booked start times
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<BookingResult | null>(null)

  // Fetch booked slots whenever selected date changes
  useEffect(() => {
    if (!selectedDate) return
    const dateStr = formatDate(selectedDate)
    setLoadingSlots(true)
    setSelectedSlot(null)
    setError(null)

    Promise.all(
      TRAINERS.map(async (t) => {
        const booked = await getBookedSlots(t.name, dateStr)
        return { name: t.name, booked }
      })
    ).then((results) => {
      const map: Record<string, string[]> = {}
      for (const r of results) map[r.name] = r.booked
      setBookedMap(map)
    }).catch(() => {
      // Non-critical — just show all slots as available
      setBookedMap({})
    }).finally(() => setLoadingSlots(false))
  }, [selectedDate])

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) return
    setConfirming(true)
    setError(null)

    const dateStr = formatDate(selectedDate)
    try {
      await bookSlot({
        lead_name: leadName,
        lead_email: leadEmail,
        trainer_name: selectedSlot.trainerName,
        slot_date: dateStr,
        slot_start: selectedSlot.start,
        slot_end: selectedSlot.end,
      })

      // Fire-and-forget notification
      notifyBooking({
        lead_name: leadName,
        lead_email: leadEmail,
        trainer_name: selectedSlot.trainerName,
        slot_date: dateStr,
        slot_start: selectedSlot.start,
        slot_end: selectedSlot.end,
      })

      const result: BookingResult = {
        trainerName: selectedSlot.trainerName,
        date: dateStr,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
      }
      setSuccess(result)
      onBooked(result)
    } catch (err) {
      if (err instanceof Error && err.message === 'SLOT_TAKEN') {
        setError('This slot was just taken. Please pick another.')
        // Re-fetch booked slots
        const updated: Record<string, string[]> = {}
        await Promise.all(
          TRAINERS.map(async (t) => {
            const booked = await getBookedSlots(t.name, formatDate(selectedDate))
            updated[t.name] = booked
          })
        )
        setBookedMap(updated)
        setSelectedSlot(null)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setConfirming(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Success state
  // ---------------------------------------------------------------------------

  if (success) {
    const d = new Date(success.date + 'T00:00:00')
    const dayName = DAY_NAMES[d.getDay()]
    const monthName = MONTH_NAMES[d.getMonth()]
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[16px] border border-[#C6D6A8] bg-[#F3F7EC] p-5 flex flex-col gap-3"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#53603E] text-white text-[16px]">
            ✓
          </span>
          <p className="text-[16px] font-semibold text-[#53603E]" style={{ fontFamily: 'var(--font-heading)' }}>
            Call booked!
          </p>
        </div>
        <div className="flex flex-col gap-1 text-[13px] text-[#2D2D2A]">
          <p><strong>Trainer:</strong> {success.trainerName}</p>
          <p><strong>Date:</strong> {dayName}, {d.getDate()} {monthName} {d.getFullYear()}</p>
          <p><strong>Time:</strong> {formatDisplayTime(success.startTime)} – {formatDisplayTime(success.endTime)}</p>
        </div>
        <p className="text-[12px] text-[#8A8577]">
          We'll send details to <strong>{leadEmail}</strong>
        </p>
      </motion.div>
    )
  }

  // ---------------------------------------------------------------------------
  // Picker UI
  // ---------------------------------------------------------------------------

  const dayOfWeek = selectedDate ? selectedDate.getDay() : -1

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="rounded-[16px] border border-[#E8E4D4] bg-[#FAFAF5] p-4 flex flex-col gap-4"
    >
      <p className="text-[13px] font-semibold text-[#2D2D2A]">Pick a date</p>

      {/* Date row */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {days.map((d) => {
          const isSelected = selectedDate ? formatDate(d) === formatDate(selectedDate) : false
          return (
            <button
              key={formatDate(d)}
              onClick={() => setSelectedDate(d)}
              className={[
                'flex shrink-0 flex-col items-center justify-center rounded-[12px] border',
                'w-[52px] h-[60px] text-center transition-colors duration-150',
                isSelected
                  ? 'bg-[#53603E] border-[#53603E] text-white'
                  : 'border-[#E8E4D4] bg-white text-[#2D2D2A] hover:border-[#53603E]',
              ].join(' ')}
            >
              <span className={['text-[10px] font-medium uppercase tracking-wide', isSelected ? 'text-[#C6D6A8]' : 'text-[#8A8577]'].join(' ')}>
                {DAY_NAMES[d.getDay()]}
              </span>
              <span className="text-[18px] font-bold leading-tight">{d.getDate()}</span>
            </button>
          )
        })}
      </div>

      {/* Slots */}
      {selectedDate && (
        <div className="flex flex-col gap-4">
          {loadingSlots ? (
            <p className="text-[13px] text-[#8A8577] text-center py-2">Loading slots…</p>
          ) : (
            TRAINERS.map((trainer) => {
              const availableSlots = trainer.slots.filter(s => s.days.includes(dayOfWeek))
              if (availableSlots.length === 0) return null
              const bookedStarts = bookedMap[trainer.name] ?? []

              return (
                <div key={trainer.name} className="flex flex-col gap-2">
                  {/* Trainer badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                      style={{ backgroundColor: trainer.color }}
                    >
                      {trainer.name}
                    </span>
                  </div>
                  {/* Slot pills */}
                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map((slot) => {
                      const isBooked = bookedStarts.includes(slot.start)
                      const isSelected =
                        selectedSlot?.trainerName === trainer.name &&
                        selectedSlot.start === slot.start

                      return (
                        <button
                          key={slot.start}
                          disabled={isBooked}
                          onClick={() =>
                            setSelectedSlot({ trainerName: trainer.name, start: slot.start, end: slot.end })
                          }
                          className={[
                            'rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors duration-150',
                            isBooked
                              ? 'border-[#E8E4D4] bg-[#F0EDE0] text-[#B8B3A0] cursor-not-allowed line-through'
                              : isSelected
                              ? 'border-[#53603E] bg-[#53603E] text-white'
                              : 'border-[#E8E4D4] bg-white text-[#2D2D2A] hover:border-[#53603E] hover:bg-[#EEF0E6]',
                          ].join(' ')}
                        >
                          {formatDisplayTime(slot.start)} – {formatDisplayTime(slot.end)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-[12px] text-[#DC2626]" role="alert">
          {error}
        </p>
      )}

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        disabled={!selectedDate || !selectedSlot || confirming}
        className={[
          'w-full h-11 rounded-[12px] text-[14px] font-semibold transition-colors duration-150',
          selectedDate && selectedSlot && !confirming
            ? 'bg-[#53603E] text-[#F5F1DD] hover:bg-[#475435] active:scale-[0.97]'
            : 'bg-[#E8E4D4] text-[#B8B3A0] cursor-not-allowed',
        ].join(' ')}
      >
        {confirming ? 'Booking…' : 'Confirm booking'}
      </button>
    </motion.div>
  )
}

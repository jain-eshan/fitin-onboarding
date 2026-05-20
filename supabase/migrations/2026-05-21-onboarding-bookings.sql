CREATE TABLE IF NOT EXISTS onboarding_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_name TEXT NOT NULL,
  lead_email TEXT,
  trainer_name TEXT NOT NULL,
  slot_date DATE NOT NULL,
  slot_start TIME NOT NULL,
  slot_end TIME NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent double-booking: unique slot per trainer per date
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_unique_slot
  ON onboarding_bookings(trainer_name, slot_date, slot_start)
  WHERE status = 'confirmed';

ALTER TABLE onboarding_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can book a slot"
  ON onboarding_bookings FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Service role full access on bookings"
  ON onboarding_bookings FOR ALL TO service_role USING (true);

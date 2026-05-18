CREATE TABLE IF NOT EXISTS onboarding_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  age INTEGER,
  city TEXT,
  activity_level TEXT CHECK (activity_level IN ('inactive', 'on_and_off', 'active')),
  goals TEXT[] DEFAULT '{}',
  barriers TEXT[] DEFAULT '{}',
  preferred_time TEXT CHECK (preferred_time IN ('early_morning', 'morning', 'evening', 'flexible')),
  diet_awareness TEXT CHECK (diet_awareness IN ('unaware', 'trying', 'mindful')),
  health_notes TEXT,
  profile_type TEXT CHECK (profile_type IN ('starter', 'restarter', 'time_cruncher', 'leveler')),
  recommended_program TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'trial', 'converted', 'dropped')),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE onboarding_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit onboarding"
  ON onboarding_leads FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Service role full access"
  ON onboarding_leads FOR ALL TO service_role USING (true);

CREATE POLICY "Users can read own lead"
  ON onboarding_leads FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_onboarding_leads_status ON onboarding_leads(status);
CREATE INDEX IF NOT EXISTS idx_onboarding_leads_created ON onboarding_leads(created_at DESC);

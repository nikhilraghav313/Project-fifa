/*
# FIFA World Cup 2026 Stadium Operations Platform — Schema

## Purpose
A GenAI-enabled platform to enhance stadium operations and the tournament
experience across navigation, crowd management, accessibility, transportation,
sustainability, multilingual assistance, operational intelligence, and
real-time decision support.

## Tables

1. `chat_messages` — Conversation history between users and the GenAI assistant.
   - `id` (uuid PK)
   - `session_id` (text) — anonymous browser session identifier
   - `role` (text) — 'user' | 'assistant'
   - `content` (text) — message text
   - `language` (text, default 'en') — ISO language code of the message
   - `intent` (text) — classified intent tag (nullable)
   - `created_at` (timestamptz)

2. `crowd_reports` — Real-time crowd density / incident observations submitted
   by venue staff and volunteers.
   - `id` (uuid PK)
   - `stadium_id` (text)
   - `zone` (text) — concourse / gate / stand name
   - `density_level` (text) — 'low' | 'moderate' | 'high' | 'critical'
   - `note` (text, nullable)
   - `reporter_role` (text) — 'staff' | 'volunteer' | 'fan'
   - `created_at` (timestamptz)

3. `accessibility_requests` — Fan-submitted accessibility assistance requests.
   - `id` (uuid PK)
   - `stadium_id` (text)
   - `request_type` (text) — 'wheelchair' | 'sensory' | 'visual' | 'hearing' | 'mobility' | 'other'
   - `location` (text, nullable)
   - `details` (text, nullable)
   - `status` (text, default 'open') — 'open' | 'in_progress' | 'resolved'
   - `created_at` (timestamptz)

4. `incidents` — Operational incidents logged by organizers / staff.
   - `id` (uuid PK)
   - `stadium_id` (text)
   - `category` (text) — 'medical' | 'security' | 'facility' | 'transport' | 'crowd' | 'other'
   - `severity` (text) — 'low' | 'medium' | 'high' | 'critical'
   - `description` (text)
   - `status` (text, default 'open') — 'open' | 'responding' | 'resolved'
   - `created_at` (timestamptz)

5. `feedback` — Post-event fan feedback / satisfaction ratings.
   - `id` (uuid PK)
   - `stadium_id` (text)
   - `rating` (int, 1-5)
   - `category` (text, nullable) — 'navigation' | 'facilities' | 'transport' | 'food' | 'accessibility' | 'other'
   - `comment` (text, nullable)
   - `created_at` (timestamptz)

## Security
- Single-tenant, no-auth app. All tables use `TO anon, authenticated` CRUD
  policies because the data is intentionally shared/public for the demo
  tournament operations dashboard.

## Notes
1. All tables are idempotent (`IF NOT EXISTS`).
2. Policies are dropped before creation to remain idempotent on re-runs.
3. Indexes added on frequently-filtered columns (stadium_id, session_id, status).
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL,
  language text NOT NULL DEFAULT 'en',
  intent text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crowd_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stadium_id text NOT NULL,
  zone text NOT NULL,
  density_level text NOT NULL CHECK (density_level IN ('low','moderate','high','critical')),
  note text,
  reporter_role text NOT NULL DEFAULT 'staff' CHECK (reporter_role IN ('staff','volunteer','fan')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accessibility_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stadium_id text NOT NULL,
  request_type text NOT NULL CHECK (request_type IN ('wheelchair','sensory','visual','hearing','mobility','other')),
  location text,
  details text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stadium_id text NOT NULL,
  category text NOT NULL CHECK (category IN ('medical','security','facility','transport','crowd','other')),
  severity text NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','responding','resolved')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stadium_id text NOT NULL,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  category text,
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_crowd_reports_stadium ON crowd_reports(stadium_id);
CREATE INDEX IF NOT EXISTS idx_accessibility_stadium ON accessibility_requests(stadium_id);
CREATE INDEX IF NOT EXISTS idx_accessibility_status ON accessibility_requests(status);
CREATE INDEX IF NOT EXISTS idx_incidents_stadium ON incidents(stadium_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_feedback_stadium ON feedback(stadium_id);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crowd_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessibility_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- chat_messages policies
DROP POLICY IF EXISTS "anon_select_chat" ON chat_messages;
CREATE POLICY "anon_select_chat" ON chat_messages FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_chat" ON chat_messages;
CREATE POLICY "anon_insert_chat" ON chat_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_chat" ON chat_messages;
CREATE POLICY "anon_update_chat" ON chat_messages FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_chat" ON chat_messages;
CREATE POLICY "anon_delete_chat" ON chat_messages FOR DELETE
  TO anon, authenticated USING (true);

-- crowd_reports policies
DROP POLICY IF EXISTS "anon_select_crowd" ON crowd_reports;
CREATE POLICY "anon_select_crowd" ON crowd_reports FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_crowd" ON crowd_reports;
CREATE POLICY "anon_insert_crowd" ON crowd_reports FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_crowd" ON crowd_reports;
CREATE POLICY "anon_update_crowd" ON crowd_reports FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_crowd" ON crowd_reports;
CREATE POLICY "anon_delete_crowd" ON crowd_reports FOR DELETE
  TO anon, authenticated USING (true);

-- accessibility_requests policies
DROP POLICY IF EXISTS "anon_select_access" ON accessibility_requests;
CREATE POLICY "anon_select_access" ON accessibility_requests FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_access" ON accessibility_requests;
CREATE POLICY "anon_insert_access" ON accessibility_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_access" ON accessibility_requests;
CREATE POLICY "anon_update_access" ON accessibility_requests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_access" ON accessibility_requests;
CREATE POLICY "anon_delete_access" ON accessibility_requests FOR DELETE
  TO anon, authenticated USING (true);

-- incidents policies
DROP POLICY IF EXISTS "anon_select_incidents" ON incidents;
CREATE POLICY "anon_select_incidents" ON incidents FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_incidents" ON incidents;
CREATE POLICY "anon_insert_incidents" ON incidents FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_incidents" ON incidents;
CREATE POLICY "anon_update_incidents" ON incidents FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_incidents" ON incidents;
CREATE POLICY "anon_delete_incidents" ON incidents FOR DELETE
  TO anon, authenticated USING (true);

-- feedback policies
DROP POLICY IF EXISTS "anon_select_feedback" ON feedback;
CREATE POLICY "anon_select_feedback" ON feedback FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_feedback" ON feedback;
CREATE POLICY "anon_insert_feedback" ON feedback FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_feedback" ON feedback;
CREATE POLICY "anon_update_feedback" ON feedback FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_feedback" ON feedback;
CREATE POLICY "anon_delete_feedback" ON feedback FOR DELETE
  TO anon, authenticated USING (true);
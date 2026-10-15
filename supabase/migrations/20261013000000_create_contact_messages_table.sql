-- ==============================================================================
-- Module 6: Contact System & Messages Schema
-- Target Database: PostgreSQL via Supabase
-- Description: Table for storing contact inquiries received through the portfolio form.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_address TEXT,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for chronological sorting and status filtering
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages (status);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 1. Public visitors can INSERT contact messages (anonymous inquiries)
CREATE POLICY "Public can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 2. Authenticated administrator can view all contact messages
CREATE POLICY "Authenticated administrator can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

-- 3. Authenticated administrator can update status (mark read / archive)
CREATE POLICY "Authenticated administrator can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Authenticated administrator can delete contact messages
CREATE POLICY "Authenticated administrator can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (true);

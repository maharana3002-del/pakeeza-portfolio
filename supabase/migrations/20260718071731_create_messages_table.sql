/*
# Create messages table for contact form

1. Purpose
   - Stores messages submitted through the PakeezaVerse portfolio contact form.
   - This is a single-tenant, no-auth portfolio site. The frontend uses the anon key,
     so anon must be allowed to INSERT new messages.

2. New Tables
   - `messages`
     - `id` (uuid, primary key, auto-generated)
     - `name` (text, not null) — sender's full name
     - `email` (text, not null) — sender's email address
     - `subject` (text, not null) — message subject line
     - `message` (text, not null) — the message body
     - `created_at` (timestamptz, default now()) — submission timestamp

3. Security
   - Enable RLS on `messages`.
   - INSERT policy for `anon, authenticated` so the public contact form can submit.
     (No SELECT/UPDATE/DELETE policies: the portfolio owner reads messages directly
     in the Supabase dashboard; the public cannot read anyone's messages.)

4. Important Notes
   - No user_id / auth.users linkage — this is a no-auth public contact form.
   - Only INSERT is exposed to the public; reads are restricted to the dashboard owner.
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_messages" ON messages;
CREATE POLICY "anon_insert_messages"
ON messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

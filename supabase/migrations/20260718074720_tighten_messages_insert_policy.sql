/*
# Tighten messages INSERT RLS policy

1. Purpose
   - Replace the previous `WITH CHECK (true)` on the `messages` INSERT policy with
     meaningful row-level validation. The public contact form still works (anon can
     insert), but inserts are now constrained to well-formed, non-empty messages.

2. Security Changes
   - Drop the old `anon_insert_messages` policy.
   - Recreate it with a WITH CHECK clause that validates:
     - name is non-empty and <= 120 chars
     - email matches a basic email pattern and <= 160 chars
     - subject is non-empty and <= 200 chars
     - message is non-empty and <= 5000 chars
   - This prevents unrestricted / malformed inserts from bypassing RLS.

3. Important Notes
   - Still single-tenant, no-auth: role is `anon, authenticated`.
   - Only INSERT is exposed; no SELECT/UPDATE/DELETE policies added.
*/

DROP POLICY IF EXISTS "anon_insert_messages" ON messages;

CREATE POLICY "anon_insert_messages"
ON messages FOR INSERT
TO anon, authenticated
WITH CHECK (
  name IS NOT NULL
  AND char_length(name) BETWEEN 1 AND 120
  AND email IS NOT NULL
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(email) <= 160
  AND subject IS NOT NULL
  AND char_length(subject) BETWEEN 1 AND 200
  AND message IS NOT NULL
  AND char_length(message) BETWEEN 1 AND 5000
);

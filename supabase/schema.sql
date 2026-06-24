-- Schema for the contact form on the landing page.
--
-- Run this once against your Supabase project (provisioned via
-- `stripe projects add supabase/project`). You can paste it into the Supabase
-- dashboard SQL editor, or run it with the Supabase CLI:
--
--   supabase db execute --file supabase/schema.sql
--
-- The browser uses the public anon key to INSERT rows. Row Level Security is
-- enabled so the anon role can ONLY insert (never read), which keeps submitted
-- messages private while still allowing the public form to work.

create table if not exists public.messages (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	email text not null,
	message text not null,
	created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Allow anyone (anon + authenticated) to submit a message.
drop policy if exists "Anyone can submit a message" on public.messages;
create policy "Anyone can submit a message"
	on public.messages
	for insert
	to anon, authenticated
	with check (true);

-- Note: no SELECT/UPDATE/DELETE policies are defined, so the anon key cannot
-- read or modify messages. View them in the Supabase dashboard, or add a policy
-- scoped to an authenticated admin user.

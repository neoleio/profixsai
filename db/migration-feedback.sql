-- One-time migration: adds the "feedback" table (customer messages/reviews)
-- to an existing ProFixSAI database. Run this once in Neon's SQL Editor.
-- Safe to run even if the table already exists (no-op in that case).

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  rating int, -- 1-5, optional
  message text not null,
  status text not null default 'New', -- New, Read, Archived
  created_at timestamptz not null default now()
);

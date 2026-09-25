-- One-time migration: adds an optional photo field to services so the admin
-- can attach/replace a picture per service instead of relying only on the
-- lucide icon. Run once in Neon's SQL Editor. Safe to re-run.

alter table services add column if not exists image_url text;

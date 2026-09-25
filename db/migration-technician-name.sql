-- One-time migration: adds a free-typed technician name field, replacing
-- the "pick from a technician account" dropdown in the Job Order forms.
-- The existing technician_id column is left untouched — it's still used
-- to restrict what a logged-in "technician" role account can see, so
-- dropping it would break that. Run once in Neon's SQL Editor.

alter table job_orders add column if not exists technician_name text;

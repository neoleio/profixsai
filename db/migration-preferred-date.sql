-- One-time migration: adds the customer's preferred drop-off/service date
-- to repair requests submitted through the public "Book a Repair" form.
-- Run once in Neon's SQL Editor. Safe to re-run.

alter table repair_requests add column if not exists preferred_date date;

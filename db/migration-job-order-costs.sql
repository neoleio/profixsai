-- One-time migration: replaces the "discount" field on job_orders with
-- "capital_cost" (what the repair cost the shop in parts/labor) and
-- "profit" (final_cost - capital_cost). Run this once in Neon's SQL Editor.
-- Safe to run even if already applied (checks before altering).

alter table job_orders add column if not exists capital_cost numeric(10,2) default 0;
alter table job_orders add column if not exists profit numeric(10,2) default 0;

-- Backfill profit for any existing rows before capital_cost was tracked.
update job_orders set profit = final_cost - capital_cost where profit = 0;

-- NOTE: this drops the discount column and its data. Back up first if you
-- need to keep historical discount records.
alter table job_orders drop column if exists discount;

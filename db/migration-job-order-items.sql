-- One-time migration: creates job_order_items if it doesn't already exist.
-- This table was defined in schema.sql, but that doesn't guarantee it was
-- ever run against your live database — if creating a job order with
-- items fails, this is almost certainly why. Safe to run either way.

create table if not exists job_order_items (
  id uuid primary key default gen_random_uuid(),
  job_order_id uuid not null references job_orders(id) on delete cascade,
  part_name text not null,
  quantity int not null default 1,
  unit_cost numeric(10,2) not null default 0
);

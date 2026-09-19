-- ProFixSAI Gadget Repair Management System
-- Target: Postgres (Neon free tier). Run this once against a fresh database.

create extension if not exists pgcrypto;

-- ---------- Roles & Users ----------
create table if not exists roles (
  id serial primary key,
  name text unique not null            -- 'admin' | 'staff' | 'technician'
);
insert into roles (name) values ('admin'), ('staff'), ('technician')
  on conflict (name) do nothing;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  password_hash text not null,
  role_id int not null references roles(id),
  is_active boolean not null default true,
  failed_login_count int not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- Customers & Devices ----------
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  contact_number text,
  email text,
  address text,
  created_at timestamptz not null default now()
);
create index if not exists idx_customers_search on customers using gin (
  to_tsvector('simple', coalesce(full_name,'') || ' ' || coalesce(contact_number,'') || ' ' || coalesce(email,''))
);

create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  device_type text not null,
  brand text,
  model text,
  serial_number text,
  imei text,
  color text,
  condition_notes text,
  created_at timestamptz not null default now()
);

-- ---------- Services offered (public catalog) ----------
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,                        -- e.g. Smartphone Repair, Laptop Repair
  description text,
  icon text,                            -- lucide icon name
  sort_order int not null default 0,
  is_active boolean not null default true
);

-- ---------- Job Orders ----------
create table if not exists job_orders (
  id uuid primary key default gen_random_uuid(),
  job_no text unique not null,          -- e.g. JO-2026-0015
  customer_id uuid not null references customers(id),
  device_id uuid not null references devices(id),
  reported_problem text,
  diagnosis text,
  requested_repair text,
  parts_required text,
  technician_id uuid references users(id),
  repair_notes text,
  estimated_cost numeric(10,2) default 0,
  final_cost numeric(10,2) default 0,
  capital_cost numeric(10,2) default 0,
  profit numeric(10,2) default 0,
  status text not null default 'Received', -- Received, Diagnosing, Waiting for Approval, Repairing, Quality Check, Completed, Released
  payment_status text not null default 'Unpaid', -- Unpaid, Partial, Paid
  date_received date not null default current_date,
  expected_completion date,
  released_at date,
  warranty_info text,
  created_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_job_orders_search on job_orders using gin (
  to_tsvector('simple', coalesce(job_no,'') || ' ' || coalesce(reported_problem,''))
);

create table if not exists job_order_items (
  id uuid primary key default gen_random_uuid(),
  job_order_id uuid not null references job_orders(id) on delete cascade,
  part_name text not null,
  quantity int not null default 1,
  unit_cost numeric(10,2) not null default 0
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  job_order_id uuid not null references job_orders(id) on delete cascade,
  amount numeric(10,2) not null,
  method text,                          -- Cash, GCash, Bank Transfer, etc.
  received_by uuid references users(id),
  paid_at timestamptz not null default now()
);

create table if not exists warranties (
  id uuid primary key default gen_random_uuid(),
  job_order_id uuid not null references job_orders(id) on delete cascade,
  coverage text,
  starts_on date,
  ends_on date
);

-- ---------- Settings (site content admins can edit) ----------
create table if not exists system_settings (
  key text primary key,
  value text
);
insert into system_settings (key, value) values
  ('facebook_url', 'https://facebook.com/profixsai'),
  ('youtube_url', 'https://youtube.com/@profixsai'),
  ('hero_headline', 'Fast & Reliable Gadget Repair'),
  ('hero_subtext', 'Professional repair services for smartphones, laptops, tablets, and other electronic devices.'),
  ('contact_phone', ''),
  ('contact_email', ''),
  ('contact_address', '')
  on conflict (key) do nothing;

-- ---------- Audit Log ----------
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  action text not null,
  entity text,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

-- ---------- Public repair requests (from the "Book a Repair" form) ----------
create table if not exists repair_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  contact_number text not null,
  email text,
  device_description text not null,
  problem_description text not null,
  status text not null default 'New', -- New, Converted, Dismissed
  created_at timestamptz not null default now()
);

-- ---------- Public feedback / reviews (from the "Leave a Message" form) ----------
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  rating int, -- 1-5, optional
  message text not null,
  status text not null default 'New', -- New, Read, Archived
  created_at timestamptz not null default now()
);


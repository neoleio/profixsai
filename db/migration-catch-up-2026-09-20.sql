-- Run this ONE file in Neon's SQL Editor to catch your database up to the
-- current code. It bundles every migration added across recent updates.
-- Every statement is guarded (if not exists / if exists) so it's safe to
-- run even if some of these were already applied individually — nothing
-- will be duplicated or error out on a second run.

-- 1) Job Order cost fields (capital cost / profit, discount removed)
alter table job_orders add column if not exists capital_cost numeric(10,2) default 0;
alter table job_orders add column if not exists profit numeric(10,2) default 0;
update job_orders set profit = final_cost - capital_cost where profit = 0;
alter table job_orders drop column if exists discount;

-- 2) Service photos
alter table services add column if not exists image_url text;

-- 3) Homepage hero slides
create table if not exists hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_text text,
  sort_order int not null default 0
);
insert into hero_slides (image_url, alt_text, sort_order)
select * from (values
  ('/assets/slide-storefront.jpg', 'ProFixSAI computer and laptop repair shopfront', 0),
  ('/assets/slide-diagnostics.jpg', 'Laptop running a full diagnostics and stress test after repair', 1),
  ('/assets/slide-reballing-station.jpg', 'Motherboard mounted on the BGA rework station for chip-level repair', 2),
  ('/assets/slide-motherboard-closeup.jpg', 'Close-up of a laptop motherboard on the rework station', 3),
  ('/assets/slide-board-teardown.jpg', 'Laptop motherboard with chips removed during a repair', 4),
  ('/assets/slide-bga-chips.jpg', 'BGA chips prepped for reinstallation on a motherboard', 5),
  ('/assets/slide-chip-ballgrid.jpg', 'Close-up of a BGA chip''s ball grid before reflow', 6),
  ('/assets/slide-chip-stencil.jpg', 'Technician aligning a chip with a reballing stencil', 7)
) as seed(image_url, alt_text, sort_order)
where not exists (select 1 from hero_slides);

-- 4) Preferred date on "Book a Repair" leads
alter table repair_requests add column if not exists preferred_date date;

-- One-time migration: adds the hero_slides table so the homepage slider is
-- admin-editable instead of hardcoded. Run once in Neon's SQL Editor.
-- Safe to re-run — seeding only happens if the table is currently empty.

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

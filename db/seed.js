// One-time seed script. Run locally with your DATABASE_URL set:
//   DATABASE_URL="postgres://..." node db/seed.js
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL);

const services = [
  ["Smartphone Repair", "Smartphone", "Diagnostics and repair for all major phone brands.", "smartphone"],
  ["Laptop Repair", "Laptop", "Hardware and software fixes for laptops and notebooks.", "laptop"],
  ["Tablet Repair", "Tablet", "Screen, battery, and charging repairs for tablets.", "tablet"],
  ["Screen Replacement", "Screen Replacement", "Cracked or dead screens replaced with quality parts.", "smartphone-charging"],
  ["Battery Replacement", "Battery Replacement", "Restore battery life and charging performance.", "battery-charging"],
  ["Charging Port Repair", "Charging Port Repair", "Fix loose, bent, or unresponsive charging ports.", "plug"],
  ["Software Troubleshooting", "Software", "OS issues, boot loops, viruses, and slow performance.", "terminal-square"],
  ["Hardware Repair", "Hardware", "Component-level repair for boards and internals.", "cpu"],
  ["Water/Liquid Damage", "Liquid Damage", "Cleaning and recovery for liquid-damaged devices.", "droplets"],
  ["Other Gadget Repairs", "Other", "Smartwatches, earbuds, consoles, and more.", "wrench"]
];

async function main() {
  for (let i = 0; i < services.length; i++) {
    const [name, category, description, icon] = services[i];
    await sql`
      insert into services (name, category, description, icon, sort_order)
      values (${name}, ${category}, ${description}, ${icon}, ${i})
    `;
  }

  const email = "admin@profixsai.local";
  const passwordHash = await bcrypt.hash("ChangeMe123!", 10);
  const roleRow = await sql`select id from roles where name = 'admin'`;
  await sql`
    insert into users (full_name, email, password_hash, role_id)
    values ('ProFixSAI Admin', ${email}, ${passwordHash}, ${roleRow[0].id})
    on conflict (email) do nothing
  `;

  console.log("Seed complete.");
  console.log(`Admin login -> email: ${email}  password: ChangeMe123!`);
  console.log("Change this password immediately after first login.");
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});

import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. API calls will fail until it is configured.");
}

// Tagged-template SQL client. Usage: await sql`select * from users where id = ${id}`
export const sql = neon(process.env.DATABASE_URL);

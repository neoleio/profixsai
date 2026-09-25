import { sql } from "./db.js";

export async function logAction({ userId, action, entity, entityId, details }) {
  await sql`
    insert into audit_logs (user_id, action, entity, entity_id, details)
    values (${userId}, ${action}, ${entity}, ${entityId}, ${details ? JSON.stringify(details) : null})
  `;
}

import handleAuditLogs from "./_lib/handlers/audit-logs.js";

export default async function handler(req, res) {
  try {
    await handleAuditLogs(req, res, []);
  } catch (err) {
    console.error("Error in /api/audit-logs:", err);
    if (!res.headersSent) res.status(500).json({ error: "Something went wrong on our end. Please try again." });
  }
}

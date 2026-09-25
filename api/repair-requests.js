import handleRepairRequests from "./_lib/handlers/repair-requests.js";

export default async function handler(req, res) {
  try {
    const rest = req.query.id ? [req.query.id] : [];
    await handleRepairRequests(req, res, rest);
  } catch (err) {
    console.error("Error in /api/repair-requests:", err);
    if (!res.headersSent) res.status(500).json({ error: "Something went wrong on our end. Please try again." });
  }
}

import handleReports from "./_lib/handlers/reports.js";

export default async function handler(req, res) {
  try {
    const rest = req.query.type ? [req.query.type] : [];
    await handleReports(req, res, rest);
  } catch (err) {
    console.error("Error in /api/reports:", err);
    if (!res.headersSent) res.status(500).json({ error: "Something went wrong on our end. Please try again." });
  }
}

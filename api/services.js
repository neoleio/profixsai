import handleServices from "./_lib/handlers/services.js";

export default async function handler(req, res) {
  try {
    const rest = req.query.id ? [req.query.id] : [];
    await handleServices(req, res, rest);
  } catch (err) {
    console.error("Error in /api/services:", err);
    if (!res.headersSent) res.status(500).json({ error: "Something went wrong on our end. Please try again." });
  }
}

import handleFeedback from "./_lib/handlers/feedback.js";

export default async function handler(req, res) {
  try {
    const rest = req.query.id ? [req.query.id] : [];
    await handleFeedback(req, res, rest);
  } catch (err) {
    console.error("Error in /api/feedback:", err);
    if (!res.headersSent) res.status(500).json({ error: "Something went wrong on our end. Please try again." });
  }
}

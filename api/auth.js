import handleAuth from "./_lib/handlers/auth.js";

export default async function handler(req, res) {
  try {
    const rest = req.query.action ? [req.query.action] : [];
    await handleAuth(req, res, rest);
  } catch (err) {
    console.error("Error in /api/auth:", err);
    if (!res.headersSent) res.status(500).json({ error: "Something went wrong on our end. Please try again." });
  }
}

import handleSettings from "./_lib/handlers/settings.js";

export default async function handler(req, res) {
  try {
    await handleSettings(req, res, []);
  } catch (err) {
    console.error("Error in /api/settings:", err);
    if (!res.headersSent) res.status(500).json({ error: "Something went wrong on our end. Please try again." });
  }
}

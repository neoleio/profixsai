import handlePublic from "../_lib/handlers/public.js";

export default async function handler(req, res) {
  try {
    await handlePublic(req, res, ["repair-request"]);
  } catch (err) {
    console.error("Error in /api/public/repair-request:", err);
    if (!res.headersSent) res.status(500).json({ error: "Something went wrong on our end. Please try again." });
  }
}

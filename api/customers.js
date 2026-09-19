import handleCustomers from "./_lib/handlers/customers.js";

export default async function handler(req, res) {
  try {
    const rest = req.query.id ? [req.query.id] : [];
    await handleCustomers(req, res, rest);
  } catch (err) {
    console.error("Error in /api/customers:", err);
    if (!res.headersSent) res.status(500).json({ error: "Something went wrong on our end. Please try again." });
  }
}

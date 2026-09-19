import handleJobOrders from "./_lib/handlers/job-orders.js";

export default async function handler(req, res) {
  try {
    const rest = [];
    if (req.query.id) rest.push(req.query.id);
    if (req.query.action) rest.push(req.query.action);
    await handleJobOrders(req, res, rest);
  } catch (err) {
    console.error("Error in /api/job-orders:", err);
    if (!res.headersSent) res.status(500).json({ error: "Something went wrong on our end. Please try again." });
  }
}

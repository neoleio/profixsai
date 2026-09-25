import handleSettings from "./_lib/handlers/settings.js";
import handleHeroSlides from "./_lib/handlers/hero-slides.js";

// Hero slides share this function instead of getting their own file —
// Vercel's Hobby plan caps a project at 12 serverless functions, and this
// project was already at that limit, so a dedicated /api/hero-slides.js
// pushed it over and broke every deployment. Routed here instead via
// ?resource=hero-slides, with no change to the /api/settings behavior.
export default async function handler(req, res) {
  try {
    if (req.query.resource === "hero-slides") {
      const rest = req.query.id ? [req.query.id] : [];
      return await handleHeroSlides(req, res, rest);
    }
    await handleSettings(req, res, []);
  } catch (err) {
    console.error("Error in /api/settings:", err);
    if (!res.headersSent) res.status(500).json({ error: "Something went wrong on our end. Please try again." });
  }
}

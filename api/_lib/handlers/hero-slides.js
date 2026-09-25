import { sql } from "../db.js";
import { getSessionFromRequest } from "../auth.js";
import { logAction } from "../audit.js";
import { methodNotAllowed, sanitizeText, sanitizeImageUrl, badRequest } from "../http.js";

async function listSlides(req, res) {
  const rows = await sql`select * from hero_slides order by sort_order asc`;
  res.status(200).json({ slides: rows });
}

async function createSlide(req, res) {
  const imageUrl = sanitizeImageUrl(req.body?.image_url);
  if (!imageUrl) return badRequest(res, "An image is required.");
  const altText = sanitizeText(req.body?.alt_text, 200) || "ProFixSAI repair work";
  const rows = await sql`
    insert into hero_slides (image_url, alt_text, sort_order)
    values (${imageUrl}, ${altText}, coalesce((select max(sort_order) + 1 from hero_slides), 0))
    returning *
  `;
  await logAction({ userId: req.session.sub, action: "Added homepage slide", entity: "hero_slides", entityId: rows[0].id });
  res.status(201).json({ slide: rows[0] });
}

async function updateSlide(req, res, id) {
  const imageProvided = Object.prototype.hasOwnProperty.call(req.body || {}, "image_url");
  const imageUrl = imageProvided ? sanitizeImageUrl(req.body.image_url) : undefined;
  if (imageProvided && !imageUrl) return badRequest(res, "That image is too large or not a valid image.");

  let rows = await sql`
    update hero_slides set
      alt_text = coalesce(${req.body?.alt_text !== undefined ? sanitizeText(req.body.alt_text, 200) : null}, alt_text),
      sort_order = coalesce(${typeof req.body?.sort_order === "number" ? req.body.sort_order : null}, sort_order)
    where id = ${id}
    returning *
  `;
  if (!rows[0]) return res.status(404).json({ error: "Slide not found." });

  if (imageProvided) {
    rows = await sql`update hero_slides set image_url = ${imageUrl} where id = ${id} returning *`;
  }

  await logAction({ userId: req.session.sub, action: "Updated homepage slide", entity: "hero_slides", entityId: id });
  res.status(200).json({ slide: rows[0] });
}

async function deleteSlide(req, res, id) {
  await sql`delete from hero_slides where id = ${id}`;
  await logAction({ userId: req.session.sub, action: "Removed homepage slide", entity: "hero_slides", entityId: id });
  res.status(200).json({ ok: true });
}

export default async function handleHeroSlides(req, res, rest) {
  const needsAdmin = req.method !== "GET";
  if (needsAdmin) {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return res.status(session ? 403 : 401).json({ error: session ? "Admin only." : "Not authenticated." });
    }
    req.session = session;
  }

  if (rest.length === 0) {
    if (req.method === "GET") return listSlides(req, res);
    if (req.method === "POST") return createSlide(req, res);
    return methodNotAllowed(res, ["GET", "POST"]);
  }
  if (rest.length === 1) {
    if (req.method === "PUT") return updateSlide(req, res, rest[0]);
    if (req.method === "DELETE") return deleteSlide(req, res, rest[0]);
    return methodNotAllowed(res, ["PUT", "DELETE"]);
  }
  res.status(404).json({ error: "Not found." });
}

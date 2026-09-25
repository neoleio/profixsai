import bcrypt from "bcryptjs";
import { sql } from "../db.js";
import {
  signSession, setSessionCookie, clearSessionCookie, getSessionFromRequest,
  recordFailedLogin, resetFailedLogins, isLocked
} from "../auth.js";
import { logAction } from "../audit.js";
import { methodNotAllowed, sanitizeText, badRequest } from "../http.js";

async function login(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  const email = sanitizeText(req.body?.email, 200).toLowerCase();
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!email || !password) return badRequest(res, "Email and password are required.");

  const rows = await sql`
    select u.id, u.full_name, u.email, u.password_hash, u.is_active, u.locked_until, r.name as role
    from users u join roles r on r.id = u.role_id
    where u.email = ${email}
  `;
  const user = rows[0];
  const genericError = () => res.status(401).json({ error: "Invalid email or password." });
  if (!user || !user.is_active) return genericError();

  if (isLocked(user)) {
    return res.status(423).json({ error: "This account is temporarily locked due to repeated failed attempts. Try again later." });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    await recordFailedLogin(user.id);
    return genericError();
  }

  await resetFailedLogins(user.id);
  const token = signSession({ id: user.id, role: user.role, full_name: user.full_name });
  setSessionCookie(res, token);
  await logAction({ userId: user.id, action: "Login", entity: "users", entityId: user.id });
  res.status(200).json({ user: { id: user.id, name: user.full_name, email: user.email, role: user.role } });
}

async function logout(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  const session = getSessionFromRequest(req);
  clearSessionCookie(res);
  if (session) await logAction({ userId: session.sub, action: "Logout", entity: "users", entityId: session.sub });
  res.status(200).json({ ok: true });
}

async function me(req, res) {
  const session = getSessionFromRequest(req);
  if (!session) return res.status(200).json({ user: null });
  res.status(200).json({ user: { id: session.sub, name: session.name, role: session.role } });
}

export default async function handleAuth(req, res, rest) {
  const action = rest[0];
  if (action === "login") return login(req, res);
  if (action === "logout") return logout(req, res);
  if (action === "me") return me(req, res);
  res.status(404).json({ error: "Unknown auth action." });
}

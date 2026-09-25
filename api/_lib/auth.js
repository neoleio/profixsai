import jwt from "jsonwebtoken";
import cookie from "cookie";
import { sql } from "./db.js";

const COOKIE_NAME = "profixsai_session";
const TOKEN_TTL_SECONDS = 60 * 60 * 8; // 8 hour session
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export function signSession(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, name: user.full_name },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_TTL_SECONDS }
  );
}

export function setSessionCookie(res, token) {
  const secure = process.env.COOKIE_SECURE !== "false";
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_TTL_SECONDS
    })
  );
}

export function clearSessionCookie(res) {
  const secure = process.env.COOKIE_SECURE !== "false";
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(COOKIE_NAME, "", {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 0
    })
  );
}

export function getSessionFromRequest(req) {
  const raw = req.headers.cookie || "";
  const parsed = cookie.parse(raw);
  const token = parsed[COOKIE_NAME];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

// Wrap an API handler so it 401s / 403s automatically.
// allowedRoles = [] means "any authenticated user".
export function requireAuth(handler, allowedRoles = []) {
  return async (req, res) => {
    const session = getSessionFromRequest(req);
    if (!session) {
      res.status(401).json({ error: "Not authenticated." });
      return;
    }
    if (allowedRoles.length && !allowedRoles.includes(session.role)) {
      res.status(403).json({ error: "You do not have permission to do that." });
      return;
    }
    req.session = session;
    return handler(req, res);
  };
}

export async function recordFailedLogin(userId) {
  const rows = await sql`
    update users
    set failed_login_count = failed_login_count + 1,
        locked_until = case
          when failed_login_count + 1 >= ${MAX_FAILED_ATTEMPTS}
          then now() + (${LOCKOUT_MINUTES} * interval '1 minute')
          else locked_until
        end
    where id = ${userId}
    returning failed_login_count, locked_until
  `;
  return rows[0];
}

export async function resetFailedLogins(userId) {
  await sql`update users set failed_login_count = 0, locked_until = null where id = ${userId}`;
}

export function isLocked(user) {
  return user.locked_until && new Date(user.locked_until) > new Date();
}

export const MAX_FAILED_ATTEMPTS_EXPORT = MAX_FAILED_ATTEMPTS;

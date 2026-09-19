# ProFixSAI — Gadget Repair Management System

A full-stack repair shop website + admin system:

- **Public site**: Home, Services, About, Repair Process, Contact, Book a Repair
- **Admin system**: job orders, customers, devices, services, users, payments,
  audit log, site settings — with role-based access (Administrator / Staff / Technician)
- **Stack**: React + Vite (frontend), Vercel Serverless Functions (backend API),
  Postgres on **Neon** (database), deployed on **Vercel**

---

## 1. Why a new database (not Supabase)

You mentioned your two Supabase free-tier project slots are already used by
`banahaw-spa` and `lark-paper-products`. Supabase's free plan caps you at 2
active projects, so this project uses **[Neon](https://neon.tech)** instead —
a separate serverless Postgres provider with its own free tier:

- 1 free project, 0.5 GB storage, that's completely independent of your
  Supabase account/limits
- Same Postgres under the hood, so the SQL in `db/schema.sql` works unchanged
- A connection string that plugs into the same `DATABASE_URL` pattern you're
  already used to

You are not required to use Neon specifically — any Postgres host works
(Railway, Fly Postgres, ElephantSQL, your own VPS). The setup steps below are
for Neon because it's the closest free-tier match to what you already use.

---

## 2. Set up the database (Neon)

1. Go to **https://neon.tech** and sign up (GitHub login is fastest).
2. Click **New Project**. Name it `profixsai`, pick a region close to your
   users (e.g. Singapore for PH), and create it.
3. Neon shows you a **connection string** right after creation, something like:
   ```
   postgresql://neondb_owner:AbCdEf123@ep-cool-fire-12345.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
   Copy this — it's your `DATABASE_URL`. (If you navigate away, find it again
   under **Dashboard → Connection Details**.)
4. Open the **SQL Editor** in the Neon dashboard (left sidebar).
5. Open `db/schema.sql` from this project, copy its entire contents, paste it
   into the SQL Editor, and click **Run**. This creates all tables (users,
   customers, devices, job_orders, payments, services, audit_logs, etc.).
6. Seed an admin account and the default services list. On your own computer
   (not in the Neon dashboard), with Node.js installed:
   ```bash
   cd profixsai
   npm install
   DATABASE_URL="paste-your-neon-connection-string-here" npm run seed
   ```
   This prints something like:
   ```
   Admin login -> email: admin@profixsai.local  password: ChangeMe123!
   ```
   **Log in and change this password immediately after your first deploy** —
   there's no "change password" screen yet, so for now, change it directly in
   Neon's SQL Editor:
   ```sql
   -- generate a new hash locally first (see note below), then:
   update users set password_hash = 'paste-new-bcrypt-hash' where email = 'admin@profixsai.local';
   ```
   Easiest path: temporarily add a "create user" step by running the app,
   logging in with the seeded account, and using **Admin → Users → Add User**
   to create your real admin account — then deactivate the seeded one.

---

## 3. Push the code to GitHub

```bash
cd profixsai
git init
git add .
git commit -m "Initial ProFixSAI build"
gh repo create neoleio/profixsai --public --source=. --push
```
(No GitHub CLI? Create the repo at github.com/new, then `git remote add origin <url>`
and `git push -u origin main`.)

---

## 4. Deploy to Vercel

1. Go to **https://vercel.com**, sign in with GitHub.
2. Click **Add New → Project**, select the `profixsai` repo.
3. Vercel auto-detects Vite. Leave build settings as default
   (`npm run build`, output directory `dist`).
4. Before clicking Deploy, open **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | your Neon connection string from step 2 |
   | `JWT_SECRET` | a long random string — generate one with `openssl rand -hex 32` |
   | `COOKIE_SECURE` | `true` |

5. Click **Deploy**. Vercel builds the frontend and deploys every file under
   `api/` as a serverless function automatically.
6. Once deployed, visit `your-project.vercel.app` for the public site, and
   `your-project.vercel.app/admin/login` for the staff login.

### Redeploying after changes
Any `git push` to your main branch triggers a new Vercel deployment
automatically — same workflow as your other projects on Vercel.

---

## 5. First login checklist

1. Go to `/admin/login`, sign in with the seeded admin account.
2. Go to **Settings** and fill in your real Facebook URL, YouTube URL, phone,
   email, and shop address — these appear immediately on the public site's
   navbar, footer, and Contact page.
3. Go to **Users**, create your real named admin account, then deactivate
   (don't delete) `admin@profixsai.local`.
4. Go to **Services** to edit, add, or hide any of the seeded services.
5. Create your first real job order under **Job Orders → New Job Order**.

---

## 6. Project structure

```
profixsai/
├── api/                  # Vercel serverless functions (the backend)
│   ├── _lib/             # shared db/auth/audit helpers
│   ├── auth/             # login, logout, session check
│   ├── job-orders/       # job order CRUD, status, payments
│   ├── customers/        # customer CRUD + history
│   ├── devices/          # device CRUD + history
│   ├── services/         # public service catalog + admin CRUD
│   ├── users/            # admin user management
│   ├── audit-logs/       # audit trail
│   ├── settings/         # editable site content
│   └── public/           # public "Book a Repair" lead form
├── db/
│   ├── schema.sql        # run this once in Neon's SQL editor
│   └── seed.js           # creates default services + admin login
├── src/
│   ├── pages/site/       # public marketing pages
│   ├── pages/admin/      # admin dashboard pages
│   ├── components/       # shared UI
│   └── lib/              # API client, auth context, settings hook
└── public/assets/        # logo + hero photo
```

---

## 7. What's intentionally left for later

Per the original spec's "future-ready" section, these are structured for but
not built yet, so the system stays simple to operate today:

- Online payment gateway (payments are currently recorded manually by staff)
- SMS/email notifications on status changes
- QR-code job orders / receipt verification
- Customer-facing repair tracking portal
- Parts inventory and stock management
- Fine-grained permissions table (the app currently uses 3 fixed roles —
  Administrator, Staff, Technician — enforced on every API route)

## 8. Security notes

- Passwords are hashed with bcrypt, never stored in plain text.
- Sessions are signed JWTs in an `httpOnly`, `Secure` cookie — not accessible
  to JavaScript, so they aren't a target for XSS.
- Every admin API route re-checks the user's role server-side — hiding a
  button in the UI is never the only protection.
- Accounts lock for 15 minutes after 5 failed login attempts.
- Every create/update/delete that matters is written to `audit_logs`.
- Change `JWT_SECRET` to your own long random value before going live —
  don't reuse the placeholder in `.env.example`.

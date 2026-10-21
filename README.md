# ProFixSAI — Gadget Repair Management System

ProFixSAI is a full-stack web application for managing a gadget repair shop. It provides a public website for customers and an administrative system for handling repair requests, job orders, customers, devices, payments, and shop information.

## Features

### Public Website
- Home, Services, About, and Repair Process pages
- Contact information and social media links
- Online repair request submission
- Customizable website content, colors, and announcements

### Admin System
- Dashboard and reports
- Repair requests and customer messages
- Job order creation, tracking, and management
- Customer and device records with repair history
- Service catalog management
- Payment recording, warranty information, and printable order slips
- User management with role-based access
- Audit logs for important administrative actions
- Built-in help guide with role-based content

### User Roles
- **Administrator** — manages users, system settings, and administrative functions
- **Staff** — handles supported customer service and repair management tasks
- **Technician** — accesses functions permitted for repair-related work

Access to administrative functions is enforced by the backend according to the user's role.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Vercel Serverless Functions |
| Database | PostgreSQL |
| Database Hosting | Neon |
| Deployment | Vercel |
| Source Control | Git and GitHub |

## Project Structure

```text
profixsai/
├── api/
│   ├── _lib/              # Shared database, authentication, and audit helpers
│   ├── auth/              # Authentication and session endpoints
│   ├── job-orders/        # Job order management
│   ├── customers/         # Customer records and history
│   ├── devices/           # Device records and history
│   ├── services/          # Service catalog
│   ├── users/             # User management
│   ├── audit-logs/        # Audit trail
│   ├── settings/          # Website settings
│   └── public/            # Public repair request endpoints
├── db/
│   ├── schema.sql         # Database schema
│   └── seed.js            # Initial data setup
├── src/
│   ├── pages/
│   │   ├── site/          # Public website pages
│   │   └── admin/         # Administrative pages
│   ├── components/        # Reusable UI components
│   └── lib/               # API client and shared utilities
└── public/
    └── assets/            # Public images and other assets
```

## Getting Started

### Prerequisites

Before setting up the project, install or prepare the following:

- [Node.js](https://nodejs.org/) and npm
- [Git](https://git-scm.com/)
- A [Neon](https://neon.tech/) PostgreSQL database, or another compatible PostgreSQL host
- A [GitHub](https://github.com/) account
- A [Vercel](https://vercel.com/) account for deployment

### 1. Clone the Repository

Replace the repository URL below with the URL of your GitHub repository.

```bash
git clone <your-repository-url>
cd profixsai
npm install
```

### 2. Configure the Database

1. Create a PostgreSQL database.
2. Open the database's SQL editor.
3. Execute the contents of `db/schema.sql` to create the required tables.
4. Keep the database connection string available for local setup and deployment.

The connection string should be assigned to the `DATABASE_URL` environment variable. Do not commit the connection string to GitHub.

If you are updating an existing database, review the applicable migration scripts before deploying the updated application. For installations that require the existing catch-up migration, run `db/migration-catch-up-2026-09-20.sql` in the database SQL editor. Back up important data before applying migrations to a production database.

### 3. Configure Environment Variables

Configure the following environment variables in your local environment and Vercel project settings.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `COOKIE_SECURE` | Controls whether authentication cookies require HTTPS |

For production, use a strong, randomly generated `JWT_SECRET` and set `COOKIE_SECURE` to `true` when serving the application over HTTPS.

Generate a secret locally with:

```bash
openssl rand -hex 32
```

Never commit real environment values to the repository. Use the project's existing environment-variable loading approach for local development, and configure production values in Vercel.

### 4. Initialize the Application

Run the project's seed script to initialize the default services and initial administrator account:

```bash
npm run seed
```

Ensure `DATABASE_URL` is configured in the terminal before running the script. Follow any initialization instructions printed by the script.

**Security:** Keep any initial login credentials private. If the seed script generates or displays a default password, do not publish it in the README or source code. Use the application's supported user-management workflow to establish a permanent administrator account, then deactivate the initial account when appropriate.

### 5. Run Locally

Start the development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

To verify that the production frontend builds successfully, run:

```bash
npm run build
```

The Vercel deployment configuration handles the backend API separately from the local Vite development server. Follow the project's API and database configuration when testing backend functionality locally.

## Deployment on Vercel

1. Push the project to a GitHub repository.
2. Sign in to [Vercel](https://vercel.com/) and import the repository.
3. Verify the build command and output directory against the project's configuration. For a standard Vite build, these are typically `npm run build` and `dist`.
4. Add `DATABASE_URL`, `JWT_SECRET`, and `COOKIE_SECURE` under the project's environment variables.
5. Deploy the application.
6. Test the public website, administrator login, database operations, and role-based access after deployment.

The public website and administrative interface are served by the deployed application. The admin login route is `/admin/login`, subject to the configured routing.

Subsequent pushes to the connected deployment branch can trigger automatic deployments.

## Website Customization

Administrators can manage the public website through **Admin → Settings**.

### General
- Contact details and social media links
- Operating hours
- Homepage slides

### Page Text & Colors
- Edit supported text throughout the public pages
- Configure text, background, highlight, and button colors
- Save changes before publishing the updated settings

### Added Text
- Add announcements, notices, and promotional content
- Choose the target page or display content across pages
- Configure placement, alignment, and colors
- Show or hide content without deleting it

The editable content definitions are maintained in `src/lib/siteContent.js`, with text rendered through `src/components/site/T.jsx`. Settings use the existing `system_settings` database table.

## Built-in Admin Help

The administrative help guide is available at `/admin/help`.

It includes categorized guidance for job orders, repair requests, customers, devices, payments, warranties, reports, website settings, user management, and troubleshooting.

Help content is maintained in `src/lib/helpContent.js`. Available topics are filtered according to the signed-in user's role.

## Security

ProFixSAI includes the following security-related controls:

- Password hashing with bcrypt
- JWT-based authentication using `httpOnly` cookies
- Server-side role checks on administrative API routes
- Temporary account lockout after repeated failed login attempts
- Audit logging for important create, update, and delete operations

These controls help protect the application but do not eliminate every security risk. Keep dependencies updated, protect production secrets, enforce HTTPS, and test access controls before using the system with real customer data.

Never commit `.env` files, database credentials, authentication secrets, real customer records, or production data to the repository.

## Planned Enhancements

The following features are not currently implemented as complete system features:

- Online payment gateway integration
- SMS and email notifications for repair status updates
- QR-code-based job order or receipt verification
- Customer-facing repair tracking portal
- Parts inventory and stock management
- Configurable, fine-grained permissions beyond the existing role-based access model

These features may be considered for future development.

## License

No license has been specified yet. Unless a license is added to the repository, reuse, redistribution, and modification are not automatically granted by this README.

---

**ProFixSAI** — A web-based management system for gadget repair operations.

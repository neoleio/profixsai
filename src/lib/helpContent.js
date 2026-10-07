// Help & Support content for the admin area, grouped by category.
// `roles` limits who sees a category/topic (omit = everyone who is signed in).
// Keep this in sync when features change — it is plain data, no code to touch.

export const HELP_CATEGORIES = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "Rocket",
    summary: "How the system fits together, who can do what, and how to sign in.",
    topics: [
      {
        id: "overview",
        title: "How the whole system works",
        intro: "ProFixSAI has two sides: the public website your customers see, and this admin area your team uses. They share one database, so what customers submit appears here instantly.",
        steps: [
          "A customer finds your public website and fills in Book a Repair (or sends a message from the Contact page).",
          "Their request lands in Repair Requests (and messages in Messages), with a red badge on the sidebar.",
          "Staff confirm the details with the customer, then convert the request into a Job Order — this creates the official record with a job number such as JO-2026-0015.",
          "The technician diagnoses and repairs the device, updating the Job Order status as work progresses.",
          "Staff record payments, set the warranty, and print an Order Slip for the customer.",
          "When the customer collects the device, the order is marked Released. Dashboard and Reports update automatically."
        ]
      },
      {
        id: "roles",
        title: "Who can do what (roles)",
        intro: "Every account has one of three roles. If a menu item is missing from your sidebar, your role doesn't include it.",
        points: [
          "Administrator — everything: all staff features plus Services, Users, Audit Logs, and Settings (website text, colors, and images).",
          "Staff — Repair Requests, Messages, Job Orders (create, edit, costs, payments, warranty), Customers, Devices, Order Slip, and Reports.",
          "Technician — Dashboard, Job Orders assigned to them, and Devices. Technicians update diagnosis, repair notes, and status; they cannot change costs or record payments."
        ]
      },
      {
        id: "login",
        title: "Signing in, sessions, and lockouts",
        points: [
          "Sign in from the Staff Login link in the public site footer (or go to /admin/login).",
          "You stay signed in for 8 hours, then you'll be asked to sign in again.",
          "After 5 wrong passwords in a row, the account is locked for 15 minutes. Wait it out, or ask an administrator.",
          "Deactivated accounts cannot sign in. An administrator can reactivate them under Users.",
          "On a shared computer, always use Log out (bottom of the sidebar)."
        ]
      },
      {
        id: "navigation",
        title: "Finding your way around",
        points: [
          "Use the sidebar on the left (on phones, the menu icon at the top right).",
          "A red number next to Repair Requests or Messages means there are new, unread items.",
          "On phones, the speech-bubble and bell icons in the top bar jump straight to Messages and Repair Requests.",
          "The round Help button at the bottom-right of every screen opens the help topics for the page you're on."
        ]
      }
    ]
  },
  {
    id: "inbox",
    title: "Repair Requests & Messages",
    icon: "Inbox",
    roles: ["admin", "staff"],
    summary: "Handle what customers send you through the public website.",
    topics: [
      {
        id: "requests",
        title: "Working with Repair Requests",
        intro: "These are leads from the public Book a Repair form: name, contact number, device, problem, and an optional preferred date.",
        steps: [
          "Open Repair Requests. New ones are marked New.",
          "Contact the customer to confirm drop-off and give a quote.",
          "Press the create job order action on that request — the form opens with the customer's details already filled in.",
          "Save the Job Order. The request is marked Converted.",
          "If a request is spam or no longer needed, set it to Dismissed instead."
        ],
        note: "Use the status filter at the top to show only New, Converted, or Dismissed requests."
      },
      {
        id: "messages",
        title: "Reading Messages and reviews",
        intro: "Messages come from the Leave a Message or Review form on the public Contact page — name, optional email, an optional 1–5 star rating, and the message.",
        points: [
          "New messages show a red badge in the sidebar.",
          "Mark Read once you've seen it; Archive to tidy it away.",
          "Use the status filter to see New, Read, or Archived messages.",
          "If the customer left an email, reply to them from your own email — replies are not sent from inside this system."
        ]
      }
    ]
  },
  {
    id: "jobs",
    title: "Job Orders",
    icon: "ClipboardList",
    summary: "The heart of the system: every repair from drop-off to release.",
    topics: [
      {
        id: "create-job",
        title: "Creating a Job Order",
        roles: ["admin", "staff"],
        steps: [
          "Go to Job Orders and press New (or convert a Repair Request).",
          "Choose the customer and the device, or add new ones.",
          "Describe the reported problem and requested repair, and type the technician's name.",
          "Add items/parts with quantity and cost, plus estimated cost and expected completion date.",
          "Save. The system assigns the job number automatically (for example JO-2026-0015)."
        ]
      },
      {
        id: "statuses",
        title: "What each status means",
        intro: "Update the status as the repair moves along so everyone — and the Dashboard — stays accurate.",
        points: [
          "Received — the device has been dropped off and logged.",
          "Diagnosing — the technician is inspecting it.",
          "Waiting for Approval — a quote was given and you're waiting for the customer's go-ahead.",
          "Not Repaired — the device couldn't be fixed or the customer declined.",
          "Completed — repair finished and tested, ready for pick-up.",
          "Released — handed back to the customer. The release date is recorded automatically."
        ]
      },
      {
        id: "job-detail",
        title: "Inside a Job Order",
        points: [
          "Status — change it from the dropdown at the top.",
          "Diagnosis & Repair — reported problem, diagnosis, parts required, technician, and repair notes.",
          "Items — the parts and services being charged.",
          "Costs & Warranty — estimated cost, final cost, capital cost (what the parts cost you), expected completion, and warranty info. Profit is calculated for you as final cost minus capital cost.",
          "Payments and Warranty Tracking — see Payments, Warranty & Order Slips.",
          "Print — opens an Order Slip pre-filled from this job."
        ]
      },
      {
        id: "find-jobs",
        title: "Searching, filtering, and deleting",
        points: [
          "Use the search box and status filter on the Job Orders list; choose how many rows to show per page.",
          "Only administrators can delete a Job Order, and deleting is permanent. Prefer changing the status instead.",
          "Technician accounts only see and update the Job Orders assigned to them."
        ]
      }
    ]
  },
  {
    id: "people",
    title: "Customers & Devices",
    icon: "Users",
    summary: "Keep a history of who you've served and what you've repaired.",
    topics: [
      {
        id: "customers",
        title: "Customers",
        roles: ["admin", "staff"],
        points: [
          "Search customers by name, contact number, or email.",
          "Add a customer from the Add button at the top of the list.",
          "Open a customer to see their devices and past job orders in one place.",
          "Check for an existing customer before adding a new one so history stays together."
        ]
      },
      {
        id: "devices",
        title: "Devices",
        points: [
          "Search by serial number, IMEI, brand, model, or owner.",
          "Open a device to see its details and every repair it has had.",
          "Recording the serial number or IMEI at drop-off makes repeat repairs and warranty claims easy to verify."
        ]
      }
    ]
  },
  {
    id: "payments",
    title: "Payments, Warranty & Order Slips",
    icon: "CreditCard",
    roles: ["admin", "staff"],
    summary: "Record money received, track warranties, and print slips for customers.",
    topics: [
      {
        id: "record-payment",
        title: "Recording a payment",
        steps: [
          "Open the Job Order and set the Final Cost first.",
          "In Payments, enter the amount and choose the method (Cash is the default).",
          "Press Record Payment."
        ],
        points: [
          "Payment status updates by itself: Unpaid (nothing received), Partial (some received), or Paid (received amount reaches the final cost).",
          "If a fully-paid job still shows Partial, check that the Final Cost is filled in and correct."
        ]
      },
      {
        id: "warranty",
        title: "Tracking a warranty",
        points: [
          "In Warranty Tracking on the Job Order, enter the coverage, start date, and end date. The end date is required.",
          "Reports shows each warranty as Active, Expiring Soon, or Expired, so you can follow up before coverage ends."
        ]
      },
      {
        id: "order-slip",
        title: "Printing an Order Slip",
        steps: [
          "Press Print on a Job Order (or open Order Slip from the sidebar to build one from scratch).",
          "Check and edit the customer, items, and deposit — everything is still editable.",
          "Choose Download PDF. Your browser's print window opens; pick Save as PDF or print it directly."
        ],
        note: "The Order Slip is a printing tool only. Edits you make on it are not saved back to the Job Order."
      }
    ]
  },
  {
    id: "reports",
    title: "Dashboard & Reports",
    icon: "BarChart3",
    summary: "See how the shop is doing at a glance.",
    topics: [
      {
        id: "dashboard",
        title: "Reading the Dashboard",
        points: [
          "Today's Income and This Month's Income appear at the top.",
          "Cards count Total, Pending, Ongoing, Completed, and Released job orders, plus Unpaid transactions and Today's job orders.",
          "The chart shows how job orders are split by status.",
          "Technicians see the Dashboard too, but Reports is for administrators and staff."
        ]
      },
      {
        id: "reports-page",
        title: "Using Reports",
        roles: ["admin", "staff"],
        points: [
          "Income Overview — money received over time periods.",
          "Revenue Trend — a chart of income so you can spot busy and slow periods.",
          "Job Order Snapshot — a summary of job orders by status.",
          "Warranty Tracker — filter by Active, Expiring Soon, or Expired."
        ]
      }
    ]
  },
  {
    id: "website",
    title: "Managing the Public Website",
    icon: "Globe",
    roles: ["admin"],
    summary: "Change what customers see: services, text, colors, images, and announcements.",
    topics: [
      {
        id: "services",
        title: "Services",
        points: [
          "Open Services to add, edit, or hide the services shown on the public site.",
          "Give each service a category, description, and an icon name — or upload a photo, which is shown instead of the icon.",
          "Use Hide from site to take a service offline without deleting it; Show on site brings it back."
        ]
      },
      {
        id: "settings-general",
        title: "Settings → General",
        points: [
          "Contact phone, email, and shop address, plus Facebook, YouTube, and TikTok links.",
          "Google Maps link for the Get Directions button — if you leave it empty, the address is used to build a map search automatically.",
          "Operating hours (one line per row).",
          "Homepage Slides: upload, replace, or remove the rotating hero images. These go live immediately — no Save button needed."
        ]
      },
      {
        id: "settings-text",
        title: "Settings → Page Text & Colors",
        intro: "Edit every piece of wording on the public site and choose its text color and background color.",
        steps: [
          "Open Settings and choose the Page Text & Colors tab.",
          "Pick a page (Home, Services, About, Repair Process, Contact, Book a Repair, or Header & Footer), or use the search box to find any text across the whole site.",
          "Type new wording in the box. Pick a Text color and a Highlight color with the swatches, or type a hex code such as #E23744.",
          "Check the small Preview under the item.",
          "Press Save changes. The public site updates right away."
        ],
        points: [
          "Highlight draws a color behind the words. For buttons it's the button color; for sections (hero, header, footer, and so on) it's the whole background.",
          "Leave a color on Default to keep the original look. Press the × next to a color to clear it.",
          "Reset on any item restores its original wording and colors; Restore page defaults does the same for the whole page.",
          "A warning appears if the text and background colors are too similar to read comfortably.",
          "Discard throws away everything you changed since your last save."
        ],
        note: "The PROFIXSAI logo wordmark, service cards (managed under Services), and the contact details (managed under General) are edited in their own places."
      },
      {
        id: "settings-added",
        title: "Settings → Added Text",
        intro: "Add your own text blocks to the site — a holiday notice, promotion, or extra information.",
        steps: [
          "Open Settings → Added Text and press Add text block.",
          "Choose the page (or Every page), whether it appears at the top or bottom, and its alignment.",
          "Enter an optional heading and the text, then pick the text and background colors.",
          "Press Save text blocks."
        ],
        points: [
          "Use the Showing / Hidden toggle to turn a block off without deleting it — handy for seasonal notices.",
          "Blocks set to Every page appear on all public pages."
        ]
      }
    ]
  },
  {
    id: "users-security",
    title: "Users & Security",
    icon: "ShieldCheck",
    roles: ["admin"],
    summary: "Manage staff accounts and review what has changed.",
    topics: [
      {
        id: "users",
        title: "Adding and managing users",
        steps: [
          "Open Users and press Add User.",
          "Enter their full name and email, choose a role, and set a temporary password (at least 8 characters).",
          "Share the password with them privately and ask them to keep it safe."
        ],
        points: [
          "Change someone's role from the dropdown on their row.",
          "When someone leaves, choose Active — deactivate. They can no longer sign in, but their history stays intact.",
          "Use the three roles deliberately: only give Administrator to people who truly need it."
        ]
      },
      {
        id: "audit",
        title: "Audit Logs",
        points: [
          "Audit Logs list important actions in order: sign-ins, job order updates, payments, settings changes, and more, with who did it and when.",
          "Check here first if something changed and you're not sure who changed it."
        ]
      },
      {
        id: "security-tips",
        title: "Keeping the system secure",
        points: [
          "If your installation still uses the original default administrator account, create your own admin and deactivate the default.",
          "Never share one login between several people — create an account for each person so the Audit Logs mean something.",
          "Deactivate accounts of former staff right away.",
          "Log out on shared or public computers."
        ]
      }
    ]
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting & FAQ",
    icon: "LifeBuoy",
    summary: "Quick fixes for the most common problems.",
    topics: [
      {
        id: "cant-login",
        title: "I can't sign in",
        points: [
          "Double-check the email and password (passwords are case-sensitive).",
          "Several wrong attempts lock the account for 15 minutes — wait, then try again.",
          "Ask an administrator to confirm your account is Active under Users."
        ]
      },
      {
        id: "missing-menu",
        title: "A menu item or button is missing",
        points: [
          "Menus depend on your role. Staff don't see Services, Users, Audit Logs, or Settings; technicians see only Dashboard, Job Orders, and Devices.",
          "If you think you need more access, ask an administrator to review your role."
        ]
      },
      {
        id: "site-not-updating",
        title: "My website changes aren't showing",
        points: [
          "Make sure you pressed Save changes (or Save text blocks) — the bar at the bottom shows 'No unsaved changes' once saved.",
          "Refresh the public page. Visitors who opened the site recently may need to reload once to see the newest version.",
          "Check that the Added Text block is set to Showing and is assigned to the page you're viewing.",
          "A color of 'Default' means the original design color is being used."
        ]
      },
      {
        id: "payment-status",
        title: "Payment status looks wrong",
        points: [
          "Payment status is worked out from payments recorded versus the Final Cost, so a missing or wrong Final Cost causes a wrong status.",
          "Update the Final Cost on the Job Order, then record any outstanding payment."
        ]
      },
      {
        id: "no-requests",
        title: "A customer says they booked, but I can't see it",
        points: [
          "Open Repair Requests and set the filter to All Statuses — it may have been dismissed or converted.",
          "Booking requires name, contact number, device, and problem. If the customer saw an error, the form wasn't sent.",
          "Messages from the Contact page are in Messages, not Repair Requests."
        ]
      },
      {
        id: "images",
        title: "A photo won't upload",
        points: [
          "Use a JPG, PNG, or WebP image.",
          "Very large photos can fail — try a smaller version or a different photo.",
          "Slides and service photos are shown on the public site right after upload."
        ]
      }
    ]
  }
];

// Which help category best matches the admin screen the user is on.
export function categoryForPath(pathname) {
  if (pathname.startsWith("/admin/repair-requests") || pathname.startsWith("/admin/messages")) return "inbox";
  if (pathname.startsWith("/admin/job-orders")) return "jobs";
  if (pathname.startsWith("/admin/customers") || pathname.startsWith("/admin/devices")) return "people";
  if (pathname.startsWith("/admin/order-slip")) return "payments";
  if (pathname.startsWith("/admin/reports") || pathname === "/admin") return "reports";
  if (pathname.startsWith("/admin/services") || pathname.startsWith("/admin/settings")) return "website";
  if (pathname.startsWith("/admin/users") || pathname.startsWith("/admin/audit-logs")) return "users-security";
  return "getting-started";
}

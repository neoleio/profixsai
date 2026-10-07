// Single catalogue of every editable piece of text on the public website.
//
// Each item has:
//   id       — also the settings key that stores the admin's override
//   label    — what the admin sees in Settings > Page Text & Colors
//   default  — the built-in wording (used whenever there's no override)
//   kind     — "text"    : editable wording + text color + highlight (background) color
//              "button"  : editable wording + text color + button color
//              "section" : background color only (a whole band/header/footer)
//   multiline— show a textarea instead of a single-line input
//
// Overrides live in the existing `system_settings` key/value table, so no
// database migration or extra serverless function is needed:
//   <id>          → the wording            (empty = use default)
//   <id>__color   → text color  (#RRGGBB)  (empty = use default)
//   <id>__bg      → background  (#RRGGBB)  (empty = use default)

const text = (id, label, def, extra = {}) => ({ id, label, default: def, kind: "text", ...extra });
const button = (id, label, def) => ({ id, label, default: def, kind: "button" });
const section = (id, label) => ({ id, label, default: "", kind: "section" });

const STEPS = [
  ["Bring Your Gadget", "Drop off your device at our shop, in person or through a scheduled pickup."],
  ["Initial Diagnosis", "Our technicians inspect the device and identify the root cause."],
  ["Repair Quote", "We explain the issue and give you a clear, upfront quote before any work begins."],
  ["Repair", "Once approved, our technicians carry out the repair using quality parts."],
  ["Quality Check", "Every repair is tested and inspected before it's marked complete."],
  ["Pick Up", "We notify you when it's ready, and you pick up your working device."]
];

const WHY = [
  ["Fast Turnaround", "Most common repairs — screens, batteries, ports — are diagnosed the same day you walk in."],
  ["Experienced Technicians", "Every repair is handled by trained technicians who know their way around the hardware."],
  ["Transparent Pricing", "You get a clear quote before any work starts — no surprise charges at pick-up."],
  ["Warranty Backed", "Repairs are covered by warranty, so you're protected after you walk out the door."],
  ["Reliable Communication", "We keep you posted at every stage — diagnosis, quote, repair, and pick-up."],
  ["Quality Parts Only", "We use parts built to last, never the cheapest option available."]
];

const TESTIMONIALS = [
  ["Marisol T.", "iPhone screen replacement", "Walked in with a cracked screen, walked out an hour later with my phone looking brand new. Fair price too."],
  ["Jericho A.", "Laptop won't charge", "They diagnosed the charging port issue for free and had it fixed the next day. Way cheaper than buying a new charger port assembly elsewhere."],
  ["Dani R.", "Water-damaged tablet", "Honestly thought my tablet was gone for good. They brought it back to life and explained exactly what they did."]
];

const ABOUT = [
  ["Skilled Technicians", "Trained to diagnose and repair a wide range of devices and issues."],
  ["Quality Parts", "We use parts built to last, not the cheapest option available."],
  ["Warranty Backed", "Every repair comes with warranty coverage for peace of mind."]
];

const TRUST = ["Experienced Technicians", "Quality Parts", "Reliable Service", "Warranty Available"];

export const GROUPS = [
  {
    id: "header",
    label: "Header & Footer",
    sections: [
      {
        label: "Top navigation bar",
        items: [
          section("nav_bg", "Header background"),
          text("nav_home", "Menu: Home", "Home"),
          text("nav_services", "Menu: Services", "Services"),
          text("nav_about", "Menu: About", "About"),
          text("nav_process", "Menu: Repair Process", "Repair Process"),
          text("nav_contact", "Menu: Contact", "Contact"),
          button("nav_book", "Header button: Book a Repair", "Book a Repair")
        ]
      },
      {
        label: "Footer",
        items: [
          section("footer_bg", "Footer background"),
          text("footer_blurb", "Footer description", "Fast, reliable gadget repair for phones, laptops, tablets, and more.", { multiline: true }),
          text("footer_links_title", "Quick links heading", "Quick Links"),
          text("footer_staff_login", "Staff login link", "Staff Login"),
          text("footer_hours_title", "Operating hours heading", "Operating Hours"),
          text("footer_directions", "Directions link", "Get Directions"),
          text("footer_follow_title", "Follow us heading", "Follow Us"),
          text("footer_copyright", "Copyright line (year is added automatically)", "ProFixSAI. All rights reserved.")
        ]
      }
    ]
  },
  {
    id: "home",
    label: "Home",
    sections: [
      {
        label: "Hero banner",
        items: [
          section("home_hero_bg", "Hero background"),
          text("hero_badge", "Small badge above headline", "Trusted Gadget Repair"),
          text("hero_headline", "Headline", "Fast & Reliable Gadget Repair"),
          text("hero_subtext", "Supporting text", "Professional repair services for smartphones, laptops, tablets, and other electronic devices.", { multiline: true }),
          button("hero_btn_primary", "Primary button", "Book a Repair"),
          button("hero_btn_secondary", "Secondary button", "View Services"),
          ...TRUST.map((t, i) => text(`trust_${i + 1}`, `Trust badge ${i + 1}`, t))
        ]
      },
      {
        label: "Why choose us",
        items: [
          text("home_why_title", "Section title", "Why Choose ProFixsai"),
          text("home_why_sub", "Section subtitle", "Repairs you can trust, from people who actually explain what's wrong."),
          ...WHY.flatMap(([title, desc], i) => [
            text(`why_${i + 1}_title`, `Reason ${i + 1} — title`, title),
            text(`why_${i + 1}_desc`, `Reason ${i + 1} — description`, desc, { multiline: true })
          ])
        ]
      },
      {
        label: "Services preview",
        items: [
          section("home_services_bg", "Section background"),
          text("home_services_title", "Section title", "Our Services"),
          text("home_services_sub", "Section subtitle", "Repairs for every device, handled by trained technicians."),
          text("home_services_link", "\"See all\" link", "See all services →"),
          text("servicecard_link", "Service card link (all cards)", "Learn More")
        ]
      },
      {
        label: "How repairs work",
        items: [
          text("home_process_title", "Section title", "How Repairs Work"),
          text("home_process_sub", "Section subtitle", "A straightforward process from drop-off to pick-up.")
        ]
      },
      {
        label: "Testimonials",
        items: [
          section("home_testi_bg", "Section background"),
          text("home_testi_title", "Section title", "What Customers Say"),
          text("home_testi_sub", "Section subtitle", "Real repairs, real relief."),
          ...TESTIMONIALS.flatMap(([name, device, quote], i) => [
            text(`testi_${i + 1}_quote`, `Testimonial ${i + 1} — quote`, quote, { multiline: true }),
            text(`testi_${i + 1}_name`, `Testimonial ${i + 1} — name`, name),
            text(`testi_${i + 1}_device`, `Testimonial ${i + 1} — device`, device)
          ])
        ]
      },
      {
        label: "Bottom call-to-action",
        items: [
          section("home_cta_bg", "Section background"),
          text("cta_title", "Title", "Got a gadget that needs fixing?"),
          text("cta_sub", "Supporting text", "Get a quote today — most repairs are diagnosed the same day."),
          button("cta_btn", "Button", "Book a Repair")
        ]
      }
    ]
  },
  {
    id: "services",
    label: "Services",
    sections: [
      {
        label: "Services page",
        items: [
          text("services_title", "Page title", "Our Services"),
          text("services_intro", "Intro text", "From cracked screens to liquid damage, we repair smartphones, laptops, tablets, and other gadgets.", { multiline: true })
        ]
      }
    ]
  },
  {
    id: "about",
    label: "About",
    sections: [
      {
        label: "About page",
        items: [
          text("about_title", "Page title", "About ProFixSAI"),
          text("about_body", "Intro paragraph", "ProFixSAI is a gadget repair shop dedicated to getting your devices back in your hands, fast. We work on smartphones, laptops, tablets, and other electronics, using quality parts and transparent pricing — no surprises at pick-up.", { multiline: true }),
          ...ABOUT.flatMap(([title, desc], i) => [
            text(`about_${i + 1}_title`, `Card ${i + 1} — title`, title),
            text(`about_${i + 1}_desc`, `Card ${i + 1} — description`, desc, { multiline: true })
          ])
        ]
      }
    ]
  },
  {
    id: "process",
    label: "Repair Process",
    sections: [
      {
        label: "Repair process page",
        items: [
          text("process_title", "Page title", "Our Repair Process"),
          text("process_intro", "Intro text", "Six simple steps from drop-off to pick-up, with clear communication the whole way through.", { multiline: true }),
          button("process_btn", "Bottom button", "Book a Repair")
        ]
      },
      {
        label: "The six steps (also shown on the Home page)",
        items: STEPS.flatMap(([title, desc], i) => [
          text(`step_${i + 1}_title`, `Step ${i + 1} — title`, title),
          text(`step_${i + 1}_desc`, `Step ${i + 1} — description`, desc, { multiline: true })
        ])
      }
    ]
  },
  {
    id: "contact",
    label: "Contact",
    sections: [
      {
        label: "Contact details",
        items: [
          text("contact_title", "Page title", "Contact Us"),
          text("contact_intro", "Intro text", "Have a question before booking a repair? Reach out any of these ways.", { multiline: true }),
          text("contact_label_phone", "Label: Phone", "Phone"),
          text("contact_label_email", "Label: Email", "Email"),
          text("contact_label_address", "Label: Address", "Address"),
          text("contact_label_hours", "Label: Operating Hours", "Operating Hours"),
          button("contact_btn_directions", "Button: Get Directions", "Get Directions"),
          button("contact_btn_facebook", "Button: Facebook", "Visit Our Facebook Page"),
          button("contact_btn_youtube", "Button: YouTube", "Watch Our Videos"),
          button("contact_btn_tiktok", "Button: TikTok", "Follow Us on TikTok")
        ]
      },
      {
        label: "Message / review form",
        items: [
          text("contact_review_title", "Form title", "Leave a Message or Review"),
          text("contact_review_intro", "Form intro", "Had a repair with us, or just have feedback? Let us know — our team reads every message.", { multiline: true }),
          text("contact_f_name", "Field label: name", "Your Name"),
          text("contact_f_email", "Field label: email", "Email (optional)"),
          text("contact_f_rating", "Field label: rating", "Rating (optional)"),
          text("contact_f_message", "Field label: message", "Message"),
          button("contact_btn_send", "Send button", "Send Message"),
          text("contact_thanks_title", "Thank-you title", "Thank you!"),
          text("contact_thanks_msg", "Thank-you message", "Your message has been sent to our team.")
        ]
      }
    ]
  },
  {
    id: "book",
    label: "Book a Repair",
    sections: [
      {
        label: "Booking form",
        items: [
          text("book_title", "Page title", "Book a Repair"),
          text("book_intro", "Intro text", "Tell us about your device and the problem — we'll get back to you to confirm details.", { multiline: true }),
          text("book_f_name", "Field label: name", "Your Name"),
          text("book_f_contact", "Field label: contact number", "Contact Number"),
          text("book_f_email", "Field label: email", "Email (optional)"),
          text("book_f_device", "Field label: device", "Device (type, brand, model)"),
          text("book_f_problem", "Field label: problem", "What's the problem?"),
          text("book_f_date", "Field label: preferred date", "Preferred Date (optional)"),
          button("book_btn_send", "Send button", "Send Request"),
          text("book_done_title", "Success title", "Request received"),
          text("book_done_msg", "Success message", "Thanks for reaching out. Our team will contact you shortly to confirm your drop-off and give you a quote.", { multiline: true })
        ]
      }
    ]
  }
];

export const ITEMS = Object.fromEntries(
  GROUPS.flatMap((g) => g.sections.flatMap((s) => s.items)).map((i) => [i.id, i])
);

export const colorKey = (id) => `${id}__color`;
export const bgKey = (id) => `${id}__bg`;

export const HEX = /^#[0-9a-fA-F]{6}$/;
const validColor = (v) => (typeof v === "string" && HEX.test(v) ? v : undefined);

// Wording: override if the admin set one, otherwise the built-in default.
export function resolveText(settings, id) {
  const override = settings?.[id];
  if (typeof override === "string" && override.trim() !== "") return override;
  return ITEMS[id]?.default ?? "";
}

// Inline style for an element. Sections only take a background; text and
// buttons take both. Returns an empty object when nothing is customised, so
// the original Tailwind styling is left completely untouched.
export function resolveStyle(settings, id) {
  const color = validColor(settings?.[colorKey(id)]);
  const bg = validColor(settings?.[bgKey(id)]);
  const kind = ITEMS[id]?.kind;
  const style = {};
  if (kind === "section") {
    if (bg) style.background = bg;
    return style;
  }
  if (color) style.color = color;
  if (bg) style.backgroundColor = bg;
  return style;
}

// "Added text" blocks the admin creates (announcements, notices, extra copy).
export const BLOCK_PAGES = [
  { id: "all", label: "Every page" },
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "process", label: "Repair Process" },
  { id: "contact", label: "Contact" },
  { id: "book", label: "Book a Repair" }
];

export const PATH_TO_PAGE = {
  "/": "home",
  "/services": "services",
  "/about": "about",
  "/repair-process": "process",
  "/contact": "contact",
  "/book-a-repair": "book"
};

export function parseBlocks(raw) {
  try {
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

// WCAG contrast ratio, used to warn the admin about unreadable combos.
export function contrastRatio(a, b) {
  const lum = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    const [r, g, bl] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

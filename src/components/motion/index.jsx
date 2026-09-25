import { motion } from "framer-motion";

// Small, reusable animation building blocks so entrance/transition motion
// looks consistent everywhere instead of one-off tuned values per page.

// Fades a section in with a gentle upward slide as it scrolls into view.
// Use for page sections (services grid, testimonials, etc.) — runs once.
export function Reveal({ children, delay = 0, className = "", as = "div", ...props }) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

// Staggers its direct children in on mount — use for hero content, stat
// cards, or any group that should cascade in together rather than as one
// block. Wrap children in <StaggerItem>.
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
};

export function StaggerGroup({ children, className = "", ...props }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className={className} {...props}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "", as = "div", ...props }) {
  const Component = motion[as] || motion.div;
  return (
    <Component variants={staggerItem} className={className} {...props}>
      {children}
    </Component>
  );
}

// Cross-fades page content on route change — drop this inside a layout's
// <main>, keyed by the current pathname where it's used.
export function PageFade({ children, pageKey }) {
  return (
    <motion.div
      key={pageKey}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

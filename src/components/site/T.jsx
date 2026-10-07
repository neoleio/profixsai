import { useLocation } from "react-router-dom";
import { useContent } from "../../lib/useContent.js";
import { useSettings } from "../../lib/useSettings.js";
import { PATH_TO_PAGE, parseBlocks } from "../../lib/siteContent.js";

// Renders one admin-editable piece of text. The wording, text color and
// highlight (background) color all come from Settings > Page Text & Colors.
// A highlight is drawn on an inner span so it hugs the words instead of
// stretching across the whole row, and wraps cleanly over multiple lines.
export default function T({ id, as: Tag = "span", className = "", children, ...rest }) {
  const { t, s } = useContent();
  const { color, backgroundColor } = s(id);
  const content = children ?? t(id);

  return (
    <Tag className={className} style={color ? { color } : undefined} {...rest}>
      {backgroundColor ? (
        <span
          style={{
            backgroundColor,
            padding: "0.05em 0.35em",
            borderRadius: "0.4em",
            boxDecorationBreak: "clone",
            WebkitBoxDecorationBreak: "clone"
          }}
        >
          {content}
        </span>
      ) : (
        content
      )}
    </Tag>
  );
}

// Text blocks the admin added (Settings > Added Text Blocks). Rendered once
// in SiteLayout, so they appear on the right pages without touching them.
export function CustomBlocks({ position }) {
  const settings = useSettings();
  const { pathname } = useLocation();
  const page = PATH_TO_PAGE[pathname];

  const blocks = parseBlocks(settings.custom_blocks).filter(
    (b) => b.enabled !== false && b.position === position && (b.page === "all" || b.page === page)
  );
  if (!blocks.length) return null;

  return (
    <div className={`container-page flex flex-col gap-4 ${position === "top" ? "pt-6" : "pt-10"}`}>
      {blocks.map((b) => (
        <div
          key={b.id}
          className="rounded-card border border-ink/10 px-6 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
          style={{
            backgroundColor: b.bg || "#FFFFFF",
            color: b.color || undefined,
            textAlign: b.align || "left"
          }}
        >
          {b.heading && <h3 className="font-display font-semibold text-lg">{b.heading}</h3>}
          {b.body && <p className={`whitespace-pre-line leading-relaxed ${b.heading ? "mt-1.5" : ""}`}>{b.body}</p>}
        </div>
      ))}
    </div>
  );
}

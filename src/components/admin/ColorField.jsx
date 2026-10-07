import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { HEX } from "../../lib/siteContent.js";

// A color swatch (opens the browser's color picker) plus a hex box. Empty
// means "use the site's default color", shown as a striped swatch.
export default function ColorField({ label, value, onChange, hint }) {
  const [text, setText] = useState(value || "");
  useEffect(() => setText(value || ""), [value]);

  function typed(v) {
    let next = v.trim();
    if (next && !next.startsWith("#")) next = `#${next}`;
    setText(next);
    if (next === "" || HEX.test(next)) onChange(next.toUpperCase());
  }

  const invalid = text !== "" && !HEX.test(text);

  return (
    <div className="flex items-center gap-2" title={hint}>
      <span className="label-sm w-[84px] shrink-0">{label}</span>
      <label
        className="relative w-9 h-9 rounded-lg border border-ink/15 overflow-hidden cursor-pointer shrink-0"
        style={
          value
            ? { background: value }
            : { background: "repeating-linear-gradient(45deg,#fff,#fff 4px,#E5E7EB 4px,#E5E7EB 8px)" }
        }
      >
        <input
          type="color"
          aria-label={label}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          value={value || "#FFFFFF"}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
        />
      </label>
      <input
        className={`input !w-[92px] !py-1.5 font-mono text-xs ${invalid ? "!border-brand-red" : ""}`}
        placeholder="Default"
        value={text}
        maxLength={7}
        onChange={(e) => typed(e.target.value)}
      />
      {value && (
        <button type="button" onClick={() => onChange("")} aria-label={`Clear ${label}`} className="text-ink/40 hover:text-brand-red">
          <X size={15} />
        </button>
      )}
    </div>
  );
}

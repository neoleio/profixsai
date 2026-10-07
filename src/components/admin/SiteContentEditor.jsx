import { useEffect, useMemo, useState } from "react";
import { Search, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { api } from "../../lib/api.js";
import { invalidateSettingsCache } from "../../lib/useSettings.js";
import { GROUPS, ITEMS, colorKey, bgKey, contrastRatio, HEX } from "../../lib/siteContent.js";
import ColorField from "./ColorField.jsx";

// Everything an item can override, as [settings key, kind of value].
function keysFor(item) {
  if (item.kind === "section") return [bgKey(item.id)];
  return [item.id, colorKey(item.id), bgKey(item.id)];
}

// "" and "same as the built-in default" are the same thing: no override.
function canon(key, value) {
  const v = (value ?? "").toString();
  const item = ITEMS[key];
  if (item && v === item.default) return "";
  return v;
}

export default function SiteContentEditor() {
  const [original, setOriginal] = useState(null);
  const [draft, setDraft] = useState({});
  const [groupId, setGroupId] = useState(GROUPS[0].id);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/settings").then(({ settings }) => {
      setOriginal(settings);
      setDraft({});
    });
  }, []);

  // Current value for a key: whatever the admin typed this session, else what's saved.
  const valueOf = (key) => (key in draft ? draft[key] : original?.[key] ?? "");
  const set = (key, value) => { setMessage(""); setDraft((d) => ({ ...d, [key]: value })); };
  // What the text box shows: what's being typed, else the saved wording, else the built-in default.
  const textValue = (item) => (item.id in draft ? draft[item.id] : original?.[item.id] || item.default);

  const changes = useMemo(() => {
    if (!original) return {};
    const out = {};
    for (const key of Object.keys(draft)) {
      const next = canon(key, draft[key]);
      const prev = canon(key, original[key]);
      if (next !== prev) out[key] = next;
    }
    return out;
  }, [draft, original]);

  const changeCount = Object.keys(changes).length;

  function changedInGroup(group) {
    const ids = new Set(group.sections.flatMap((s) => s.items.flatMap(keysFor)));
    return Object.keys(changes).filter((k) => ids.has(k)).length;
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      await api.put("/settings", { settings: changes });
      setOriginal((o) => ({ ...o, ...changes }));
      setDraft({});
      invalidateSettingsCache();
      setMessage("Saved — your changes are live on the public site.");
    } catch (err) {
      setMessage(err.message);
    }
    setSaving(false);
  }

  function resetItem(item) {
    keysFor(item).forEach((k) => set(k, k === item.id ? item.default : ""));
  }

  function resetGroup(group) {
    if (!confirm(`Restore all "${group.label}" text and colors to the original defaults? You can still discard before saving.`)) return;
    group.sections.forEach((s) => s.items.forEach(resetItem));
  }

  if (!original) return <p className="text-ink/50 mt-6">Loading…</p>;

  const group = GROUPS.find((g) => g.id === groupId);
  const q = query.trim().toLowerCase();
  const matches = (item) =>
    !q || item.label.toLowerCase().includes(q) || item.default.toLowerCase().includes(q) || (valueOf(item.id) || "").toLowerCase().includes(q);

  // While searching, look across every page instead of just the open one.
  const visibleGroups = q ? GROUPS : [group];

  return (
    <div className="mt-6">
      <div className="card p-5">
        <p className="text-sm text-ink/70">
          Edit any wording on the public site, and change its <strong>text color</strong> and <strong>background (highlight) color</strong>.
          Leave a box on <em>Default</em> to keep the original look. Nothing goes live until you press <strong>Save changes</strong>.
        </p>
        <div className="relative mt-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
          <input className="input !pl-9" placeholder="Search all text on the site…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {!q && (
          <div className="flex flex-wrap gap-2 mt-4">
            {GROUPS.map((g) => {
              const n = changedInGroup(g);
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGroupId(g.id)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    g.id === groupId ? "bg-brand-blue text-white border-brand-blue" : "border-ink/15 text-ink/70 hover:border-ink/40"
                  }`}
                >
                  {g.label}
                  {n > 0 && <span className="ml-1.5 text-[11px] font-bold opacity-80">●{n}</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {visibleGroups.map((g) => {
        const sections = g.sections
          .map((s) => ({ ...s, items: s.items.filter(matches) }))
          .filter((s) => s.items.length);
        if (!sections.length) return null;
        return (
          <div key={g.id} className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display font-semibold text-lg">{g.label}</h2>
              {!q && (
                <button type="button" onClick={() => resetGroup(g)} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/50 hover:text-brand-red">
                  <RotateCcw size={14} /> Restore page defaults
                </button>
              )}
            </div>
            {sections.map((s) => (
              <div key={s.label} className="mt-3">
                <p className="font-display font-semibold text-xs uppercase tracking-wide text-ink/40 mb-2">{s.label}</p>
                <div className="flex flex-col gap-3">
                  {s.items.map((item) => (
                    <ItemRow key={item.id} item={item} valueOf={valueOf} textValue={textValue} set={set} onReset={() => resetItem(item)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {q && !visibleGroups.some((g) => g.sections.some((s) => s.items.some(matches))) && (
        <p className="text-ink/50 mt-6 text-sm">No text matches "{query}".</p>
      )}

      <div className="sticky bottom-4 mt-8 z-10">
        <div className="card p-4 flex flex-wrap items-center gap-3 shadow-lg">
          <button type="button" onClick={save} disabled={saving || !changeCount} className="btn-primary disabled:opacity-50">
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button type="button" onClick={() => { setDraft({}); setMessage(""); }} disabled={!changeCount} className="btn-secondary disabled:opacity-50">
            Discard
          </button>
          <span className="text-sm text-ink/60">
            {changeCount ? `${changeCount} unsaved change${changeCount > 1 ? "s" : ""}` : "No unsaved changes"}
          </span>
          {message && (
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle2 size={15} /> {message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ItemRow({ item, valueOf, textValue, set, onReset }) {
  const isSection = item.kind === "section";
  const typed = textValue(item);
  const shownText = typed === "" ? item.default : typed;
  const color = valueOf(colorKey(item.id));
  const bg = valueOf(bgKey(item.id));
  const customised =
    canon(item.id, typed) !== "" || [colorKey(item.id), bgKey(item.id)].some((k) => canon(k, valueOf(k)) !== "");
  const lowContrast = !isSection && HEX.test(color) && HEX.test(bg) && contrastRatio(color, bg) < 3;

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-ink/80">{item.label}</p>
        {customised && (
          <button type="button" onClick={onReset} className="inline-flex items-center gap-1 text-xs font-medium text-ink/45 hover:text-brand-red shrink-0">
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {!isSection && (
        item.multiline ? (
          <textarea
            className="input mt-2 min-h-[72px]"
            value={typed}
            onChange={(e) => set(item.id, e.target.value)}
          />
        ) : (
          <input
            className="input mt-2"
            value={typed}
            onChange={(e) => set(item.id, e.target.value)}
          />
        )
      )}

      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
        {!isSection && <ColorField label="Text color" value={color} onChange={(v) => set(colorKey(item.id), v)} />}
        <ColorField
          label={isSection ? "Background" : item.kind === "button" ? "Button color" : "Highlight"}
          value={bg}
          onChange={(v) => set(bgKey(item.id), v)}
          hint={item.kind === "text" ? "A background color drawn behind the words" : undefined}
        />
      </div>

      {lowContrast && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-700">
          <AlertTriangle size={13} /> These two colors are very close — the text may be hard to read.
        </p>
      )}

      {(color || bg) && (
        <div className="mt-3 rounded-lg border border-ink/10 bg-fog-50 px-3 py-2.5 overflow-hidden">
          <p className="label-sm mb-1.5">Preview</p>
          {isSection ? (
            <div className="h-8 rounded-md border border-ink/10" style={{ background: bg || "#EDF0F5" }} />
          ) : item.kind === "button" ? (
            <span className="inline-block rounded-lg px-4 py-2 text-sm font-semibold" style={{ background: bg || "#E23744", color: color || "#FFFFFF" }}>
              {shownText}
            </span>
          ) : (
            <span
              className="text-sm"
              style={{
                color: color || undefined,
                backgroundColor: bg || undefined,
                padding: bg ? "0.05em 0.35em" : undefined,
                borderRadius: "0.4em",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone"
              }}
            >
              {shownText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

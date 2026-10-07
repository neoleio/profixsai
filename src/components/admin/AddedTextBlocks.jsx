import { useEffect, useState } from "react";
import { Plus, Trash2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { api } from "../../lib/api.js";
import { invalidateSettingsCache } from "../../lib/useSettings.js";
import { BLOCK_PAGES, parseBlocks } from "../../lib/siteContent.js";
import ColorField from "./ColorField.jsx";

const MAX_BLOCKS = 20;
const newId = () => (globalThis.crypto?.randomUUID?.() || `b${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`);

const emptyBlock = () => ({
  id: newId(),
  enabled: true,
  page: "all",
  position: "top",
  heading: "",
  body: "",
  color: "",
  bg: "#FEF3C7",
  align: "left"
});

export default function AddedTextBlocks() {
  const [blocks, setBlocks] = useState(null);
  const [saved, setSaved] = useState("[]");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/settings").then(({ settings }) => {
      const list = parseBlocks(settings.custom_blocks);
      setBlocks(list);
      setSaved(JSON.stringify(list));
    });
  }, []);

  if (!blocks) return <p className="text-ink/50 mt-6">Loading…</p>;

  const json = JSON.stringify(blocks);
  const dirty = json !== saved;
  const tooBig = json.length > 19000;

  function update(id, patch) {
    setMessage("");
    setBlocks((list) => list.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      await api.put("/settings", { settings: { custom_blocks: json } });
      setSaved(json);
      invalidateSettingsCache();
      setMessage("Saved — live on the public site.");
    } catch (err) {
      setMessage(err.message);
    }
    setSaving(false);
  }

  return (
    <div className="mt-6">
      <div className="card p-5">
        <p className="text-sm text-ink/70">
          Add your own text to the public site — an announcement, a holiday notice, a promo, or extra information. Choose which
          page it appears on, whether it sits at the <strong>top</strong> or <strong>bottom</strong> of the page, and its colors.
        </p>
        <button
          type="button"
          onClick={() => setBlocks((l) => [...l, emptyBlock()])}
          disabled={blocks.length >= MAX_BLOCKS}
          className="btn-secondary mt-4 disabled:opacity-50"
        >
          <Plus size={16} /> Add text block
        </button>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {blocks.length === 0 && <p className="text-sm text-ink/50">No added text yet. Press “Add text block” to create one.</p>}

        {blocks.map((b, i) => (
          <div key={b.id} className={`card p-5 ${b.enabled === false ? "opacity-70" : ""}`}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-display font-semibold text-sm">Text block {i + 1}</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => update(b.id, { enabled: b.enabled === false })}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-brand-blue"
                >
                  {b.enabled === false ? <><EyeOff size={15} /> Hidden</> : <><Eye size={15} /> Showing</>}
                </button>
                <button
                  type="button"
                  onClick={() => confirm("Delete this text block?") && setBlocks((l) => l.filter((x) => x.id !== b.id))}
                  aria-label="Delete text block"
                  className="text-ink/40 hover:text-brand-red"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-3">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-ink/80">Show on</span>
                <select className="input" value={b.page} onChange={(e) => update(b.id, { page: e.target.value })}>
                  {BLOCK_PAGES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-ink/80">Position</span>
                <select className="input" value={b.position} onChange={(e) => update(b.id, { position: e.target.value })}>
                  <option value="top">Top of page</option>
                  <option value="bottom">Bottom of page</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-ink/80">Alignment</span>
                <select className="input" value={b.align} onChange={(e) => update(b.id, { align: e.target.value })}>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-sm mt-3">
              <span className="font-medium text-ink/80">Heading (optional)</span>
              <input className="input" maxLength={120} value={b.heading} onChange={(e) => update(b.id, { heading: e.target.value })} placeholder="e.g. Holiday Hours" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm mt-3">
              <span className="font-medium text-ink/80">Text</span>
              <textarea className="input min-h-[84px]" maxLength={800} value={b.body} onChange={(e) => update(b.id, { body: e.target.value })} placeholder="e.g. We're closed on Dec 25 and Jan 1. Happy holidays!" />
            </label>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
              <ColorField label="Text color" value={b.color} onChange={(v) => update(b.id, { color: v })} />
              <ColorField label="Background" value={b.bg} onChange={(v) => update(b.id, { bg: v })} />
            </div>

            {(b.heading || b.body) && (
              <div className="mt-4">
                <p className="label-sm mb-1.5">Preview</p>
                <div
                  className="rounded-card border border-ink/10 px-6 py-5"
                  style={{ backgroundColor: b.bg || "#FFFFFF", color: b.color || undefined, textAlign: b.align }}
                >
                  {b.heading && <h3 className="font-display font-semibold text-lg">{b.heading}</h3>}
                  {b.body && <p className={`whitespace-pre-line leading-relaxed ${b.heading ? "mt-1.5" : ""}`}>{b.body}</p>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 mt-6 z-10">
        <div className="card p-4 flex flex-wrap items-center gap-3 shadow-lg">
          <button type="button" onClick={save} disabled={saving || !dirty || tooBig} className="btn-primary disabled:opacity-50">
            {saving ? "Saving…" : "Save text blocks"}
          </button>
          <button type="button" onClick={() => { setBlocks(JSON.parse(saved)); setMessage(""); }} disabled={!dirty} className="btn-secondary disabled:opacity-50">
            Discard
          </button>
          <span className="text-sm text-ink/60">{dirty ? "Unsaved changes" : "No unsaved changes"}</span>
          {tooBig && <span className="text-sm text-brand-red">Too much text — shorten or remove a block.</span>}
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

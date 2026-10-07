import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, X } from "lucide-react";
import { api } from "../../lib/api.js";
import { invalidateSettingsCache } from "../../lib/useSettings.js";
import ImageUpload from "../../components/admin/ImageUpload.jsx";
import SiteContentEditor from "../../components/admin/SiteContentEditor.jsx";
import AddedTextBlocks from "../../components/admin/AddedTextBlocks.jsx";

const FIELDS = [
  { key: "facebook_url", label: "Facebook Page URL", placeholder: "https://facebook.com/yourpage" },
  { key: "youtube_url", label: "YouTube Channel URL", placeholder: "https://youtube.com/@yourchannel" },
  { key: "tiktok_url", label: "TikTok Profile URL", placeholder: "https://tiktok.com/@yourshop" },
  { key: "contact_phone", label: "Contact Phone" },
  { key: "contact_email", label: "Contact Email" },
  { key: "contact_address", label: "Shop Address" },
  { key: "map_url", label: "Google Maps Link", placeholder: "https://maps.app.goo.gl/..." },
  {
    key: "operating_hours",
    label: "Operating Hours",
    textarea: true,
    placeholder: "Mon–Sat: 9:00 AM – 6:00 PM\nSun: Closed"
  }
];

const TABS = [
  { id: "general", label: "General" },
  { id: "content", label: "Page Text & Colors" },
  { id: "blocks", label: "Added Text" }
];

export default function SettingsPage() {
  const [tab, setTab] = useState("general");

  return (
    <div className="max-w-4xl">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/50 hover:text-brand-blue transition-colors">
        <ArrowLeft size={15} /> Back to Dashboard
      </Link>
      <h1 className="font-display font-bold text-2xl mt-3">Site Settings</h1>
      <p className="text-ink/60 mt-1">Control the text, colors, links, and images shown on the public ProFixSAI website.</p>

      <div className="flex flex-wrap gap-2 mt-5 border-b border-ink/10 pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.id ? "bg-ink text-white" : "text-ink/60 hover:bg-ink/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "general" && <GeneralSettings />}
      {tab === "content" && <SiteContentEditor />}
      {tab === "blocks" && <AddedTextBlocks />}
    </div>
  );
}

function GeneralSettings() {
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function loadSettings() {
    api.get("/settings").then(({ settings }) => setValues(settings));
  }

  useEffect(() => { loadSettings(); }, []);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const own = Object.fromEntries(FIELDS.map(({ key }) => [key, values[key] || ""]));
    await api.put("/settings", { settings: own });
    invalidateSettingsCache();
    setSaving(false);
    setSaved(true);
  }

  function clearForm() {
    setSaved(false);
    loadSettings();
  }

  return (
    <div className="max-w-2xl">
      <p className="text-ink/60 mt-5 text-sm">
        Contact details, social links, and operating hours. To change the homepage headline or any other wording and colors,
        use the <strong>Page Text &amp; Colors</strong> tab.
      </p>

      <form onSubmit={save} className="card p-6 mt-4 flex flex-col gap-4">
        {FIELDS.map(({ key, label, textarea, placeholder }) => (
          <label key={key} className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink/80">{label}</span>
            {textarea ? (
              <textarea placeholder={placeholder} className="input" value={values[key] || ""} onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))} />
            ) : (
              <input placeholder={placeholder} className="input" value={values[key] || ""} onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))} />
            )}
          </label>
        ))}
        {saved && <p className="text-sm text-emerald-600">Settings saved.</p>}
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Saving…" : "Save Settings"}
          </button>
          <button type="button" onClick={clearForm} className="btn-secondary">
            <RotateCcw size={15} /> Clear
          </button>
        </div>
      </form>

      <HeroSlidesManager />
    </div>
  );
}

function HeroSlidesManager() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    api.get("/settings?resource=hero-slides").then(({ slides }) => { setSlides(slides); setLoading(false); });
  }
  useEffect(() => { load(); }, []);

  async function addSlide(image_url) {
    if (!image_url) return;
    const { slide } = await api.post("/settings?resource=hero-slides", { image_url });
    setSlides((prev) => [...prev, slide]);
  }

  async function replaceSlide(id, image_url) {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, image_url } : s)));
    await api.put(`/settings?resource=hero-slides&id=${id}`, { image_url });
  }

  async function removeSlide(id) {
    if (!confirm("Remove this slide from the homepage?")) return;
    setSlides((prev) => prev.filter((s) => s.id !== id));
    await api.del(`/settings?resource=hero-slides&id=${id}`);
  }

  return (
    <div className="card p-6 mt-6">
      <h2 className="font-display font-semibold">Homepage Slides</h2>
      <p className="text-ink/60 text-sm mt-1">
        These images rotate in the homepage hero banner. Changes here go live on the site as soon as you add,
        replace, or remove a slide — no separate save step needed.
      </p>

      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
          {slides.map((s) => (
            <div key={s.id} className="relative group">
              <img src={s.image_url} alt={s.alt_text || ""} className="w-full h-28 object-cover rounded-lg border border-ink/10" />
              <button
                onClick={() => removeSlide(s.id)}
                aria-label="Remove slide"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-ink text-white grid place-items-center hover:bg-brand-red"
              >
                <X size={13} />
              </button>
              <div className="mt-1.5">
                <ImageUpload mode="button" onChange={(url) => replaceSlide(s.id, url)} label="slide" />
              </div>
            </div>
          ))}

          <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-ink/20 rounded-lg h-28 p-3">
            <ImageUpload value="" onChange={addSlide} label="new slide" />
          </div>
        </div>
      )}
    </div>
  );
}

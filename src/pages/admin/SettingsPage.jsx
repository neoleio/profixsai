import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { api } from "../../lib/api.js";
import { invalidateSettingsCache } from "../../lib/useSettings.js";

const FIELDS = [
  { key: "hero_headline", label: "Homepage Headline" },
  { key: "hero_subtext", label: "Homepage Supporting Text", textarea: true },
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

export default function SettingsPage() {
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
    await api.put("/settings", { settings: values });
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
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/50 hover:text-brand-blue transition-colors">
        <ArrowLeft size={15} /> Back to Dashboard
      </Link>
      <h1 className="font-display font-bold text-2xl mt-3">Site Settings</h1>
      <p className="text-ink/60 mt-1">Edit the text and links shown on the public ProFixSAI website.</p>

      <form onSubmit={save} className="card p-6 mt-6 flex flex-col gap-4">
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
    </div>
  );
}

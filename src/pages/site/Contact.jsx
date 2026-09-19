import { useState } from "react";
import { Facebook, Youtube, Mail, Phone, MapPin, Star, Clock } from "lucide-react";
import { useSettings, getMapUrl } from "../../lib/useSettings.js";
import { api } from "../../lib/api.js";
import TikTokIcon from "../../components/site/TikTokIcon.jsx";

const emptyForm = { full_name: "", email: "", rating: 0, message: "" };

export default function Contact() {
  const settings = useSettings();
  const mapUrl = getMapUrl(settings);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error
  const [error, setError] = useState("");

  async function submitMessage(e) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      await api.post("/feedback", { ...form, rating: form.rating || null });
      setStatus("done");
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div className="container-page py-14 max-w-2xl">
      <h1 className="font-display font-bold text-3xl">Contact Us</h1>
      <p className="text-ink/60 mt-2">Have a question before booking a repair? Reach out any of these ways.</p>

      <div className="grid gap-4 mt-8">
        {settings.contact_phone && (
          <div className="card p-5 flex items-center gap-4">
            <Phone className="text-brand-blue" />
            <div>
              <p className="text-xs text-ink/50">Phone</p>
              <p className="font-medium">{settings.contact_phone}</p>
            </div>
          </div>
        )}
        {settings.contact_email && (
          <div className="card p-5 flex items-center gap-4">
            <Mail className="text-brand-blue" />
            <div>
              <p className="text-xs text-ink/50">Email</p>
              <p className="font-medium">{settings.contact_email}</p>
            </div>
          </div>
        )}
        {settings.contact_address && (
          <div className="card p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <MapPin className="text-brand-blue" />
              <div>
                <p className="text-xs text-ink/50">Address</p>
                <p className="font-medium">{settings.contact_address}</p>
              </div>
            </div>
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noreferrer" className="btn-secondary shrink-0">
                <MapPin size={16} /> Get Directions
              </a>
            )}
          </div>
        )}
        {settings.operating_hours && (
          <div className="card p-5 flex items-center gap-4">
            <Clock className="text-brand-blue" />
            <div>
              <p className="text-xs text-ink/50">Operating Hours</p>
              <p className="font-medium whitespace-pre-line">{settings.operating_hours}</p>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-3 mt-2">
          {settings.facebook_url && (
            <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="btn-secondary">
              <Facebook size={16} /> Visit Our Facebook Page
            </a>
          )}
          {settings.youtube_url && (
            <a href={settings.youtube_url} target="_blank" rel="noreferrer" className="btn-secondary">
              <Youtube size={16} /> Watch Our Videos
            </a>
          )}
          {settings.tiktok_url && (
            <a href={settings.tiktok_url} target="_blank" rel="noreferrer" className="btn-secondary">
              <TikTokIcon size={16} /> Follow Us on TikTok
            </a>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display font-bold text-2xl">Leave a Message or Review</h2>
        <p className="text-ink/60 mt-1">
          Had a repair with us, or just have feedback? Let us know — our team reads every message.
        </p>

        {status === "done" ? (
          <div className="card p-6 mt-6 text-center">
            <p className="font-display font-semibold text-lg">Thank you!</p>
            <p className="text-ink/60 mt-1">Your message has been sent to our team.</p>
          </div>
        ) : (
          <form onSubmit={submitMessage} className="card p-6 mt-6 flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-ink/80">Your Name</span>
                <input required className="input" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-ink/80">Email (optional)</span>
                <input type="email" className="input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </label>
            </div>

            <div className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-ink/80">Rating (optional)</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rating: f.rating === n ? 0 : n }))}
                    className="p-0.5"
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  >
                    <Star size={22} className={n <= form.rating ? "text-amber-400" : "text-ink/20"} fill={n <= form.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-ink/80">Message</span>
              <textarea required className="input min-h-[110px]" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
            </label>

            {error && <p className="text-sm text-brand-red">{error}</p>}

            <button type="submit" disabled={status === "submitting"} className="btn-primary self-start disabled:opacity-60">
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

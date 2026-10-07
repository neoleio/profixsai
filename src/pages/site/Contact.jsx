import { useState } from "react";
import { Facebook, Youtube, Mail, Phone, MapPin, Star, Clock } from "lucide-react";
import { getMapUrl } from "../../lib/useSettings.js";
import { useContent } from "../../lib/useContent.js";
import T from "../../components/site/T.jsx";
import { api } from "../../lib/api.js";
import TikTokIcon from "../../components/site/TikTokIcon.jsx";

const emptyForm = { full_name: "", email: "", rating: 0, message: "" };

export default function Contact() {
  const { settings, t, s } = useContent();
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
      <T as="h1" id="contact_title" className="block font-display font-bold text-3xl" />
      <T as="p" id="contact_intro" className="block text-ink/60 mt-2" />

      <div className="grid gap-4 mt-8">
        {settings.contact_phone && (
          <div className="card p-5 flex items-center gap-4">
            <Phone className="text-brand-blue" />
            <div>
              <T as="p" id="contact_label_phone" className="block text-xs text-ink/50" />
              <p className="font-medium">{settings.contact_phone}</p>
            </div>
          </div>
        )}
        {settings.contact_email && (
          <div className="card p-5 flex items-center gap-4">
            <Mail className="text-brand-blue" />
            <div>
              <T as="p" id="contact_label_email" className="block text-xs text-ink/50" />
              <p className="font-medium">{settings.contact_email}</p>
            </div>
          </div>
        )}
        {settings.contact_address && (
          <div className="card p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <MapPin className="text-brand-blue" />
              <div>
                <T as="p" id="contact_label_address" className="block text-xs text-ink/50" />
                <p className="font-medium">{settings.contact_address}</p>
              </div>
            </div>
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noreferrer" style={s("contact_btn_directions")} className="btn-secondary shrink-0">
                <MapPin size={16} /> {t("contact_btn_directions")}
              </a>
            )}
          </div>
        )}
        {settings.operating_hours && (
          <div className="card p-5 flex items-center gap-4">
            <Clock className="text-brand-blue" />
            <div>
              <T as="p" id="contact_label_hours" className="block text-xs text-ink/50" />
              <p className="font-medium whitespace-pre-line">{settings.operating_hours}</p>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-3 mt-2">
          {settings.facebook_url && (
            <a href={settings.facebook_url} target="_blank" rel="noreferrer" style={s("contact_btn_facebook")} className="btn-secondary">
              <Facebook size={16} /> {t("contact_btn_facebook")}
            </a>
          )}
          {settings.youtube_url && (
            <a href={settings.youtube_url} target="_blank" rel="noreferrer" style={s("contact_btn_youtube")} className="btn-secondary">
              <Youtube size={16} /> {t("contact_btn_youtube")}
            </a>
          )}
          {settings.tiktok_url && (
            <a href={settings.tiktok_url} target="_blank" rel="noreferrer" style={s("contact_btn_tiktok")} className="btn-secondary">
              <TikTokIcon size={16} /> {t("contact_btn_tiktok")}
            </a>
          )}
        </div>
      </div>

      <div className="mt-12">
        <T as="h2" id="contact_review_title" className="block font-display font-bold text-2xl" />
        <T as="p" id="contact_review_intro" className="block text-ink/60 mt-1" />

        {status === "done" ? (
          <div className="card p-6 mt-6 text-center">
            <T as="p" id="contact_thanks_title" className="block font-display font-semibold text-lg" />
            <T as="p" id="contact_thanks_msg" className="block text-ink/60 mt-1" />
          </div>
        ) : (
          <form onSubmit={submitMessage} className="card p-6 mt-6 flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5 text-sm">
                <T id="contact_f_name" className="font-medium text-ink/80" />
                <input required className="input" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <T id="contact_f_email" className="font-medium text-ink/80" />
                <input type="email" className="input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </label>
            </div>

            <div className="flex flex-col gap-1.5 text-sm">
              <T id="contact_f_rating" className="font-medium text-ink/80" />
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
              <T id="contact_f_message" className="font-medium text-ink/80" />
              <textarea required className="input min-h-[110px]" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
            </label>

            {error && <p className="text-sm text-brand-red">{error}</p>}

            <button type="submit" disabled={status === "submitting"} style={s("contact_btn_send")} className="btn-primary self-start disabled:opacity-60">
              {status === "submitting" ? "Sending..." : t("contact_btn_send")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

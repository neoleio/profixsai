import { Link } from "react-router-dom";
import { Facebook, Youtube, MapPin, Clock } from "lucide-react";
import { useSettings, getMapUrl } from "../../lib/useSettings.js";
import Logotype from "./Logotype.jsx";
import TikTokIcon from "./TikTokIcon.jsx";

export default function Footer() {
  const settings = useSettings();
  const mapUrl = getMapUrl(settings);

  return (
    <footer className="bg-white border-t border-ink/10 text-ink/60 mt-24">
      <div className="container-page py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <img src="/assets/logo.png" alt="ProFixSAI logo" className="w-8 h-8 rounded-full object-cover" />
            <Logotype size="lg" light subtitle />
          </div>
          <p className="text-sm max-w-xs">Fast, reliable gadget repair for phones, laptops, tablets, and more.</p>
        </div>
        <div>
          <p className="text-ink text-sm font-semibold mb-3">Quick Links</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-brand-blue">Services</Link></li>
            <li><Link to="/repair-process" className="hover:text-brand-blue">Repair Process</Link></li>
            <li><Link to="/about" className="hover:text-brand-blue">About</Link></li>
            <li><Link to="/contact" className="hover:text-brand-blue">Contact</Link></li>
            <li><Link to="/admin/login" className="hover:text-brand-blue">Staff Login</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-ink text-sm font-semibold mb-3 flex items-center gap-1.5"><Clock size={15} /> Operating Hours</p>
          <p className="text-sm whitespace-pre-line">{settings.operating_hours}</p>
          {mapUrl && (
            <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-brand-blue font-medium mt-3 hover:text-brand-blueDeep">
              <MapPin size={15} /> Get Directions
            </a>
          )}
        </div>
        <div>
          <p className="text-ink text-sm font-semibold mb-3">Follow Us</p>
          <div className="flex gap-3">
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="w-9 h-9 grid place-items-center rounded-full bg-ink/5 hover:bg-brand-blue hover:text-white transition-all duration-200 hover:-translate-y-0.5">
                <Facebook size={16} />
              </a>
            )}
            {settings.youtube_url && (
              <a href={settings.youtube_url} target="_blank" rel="noreferrer" className="w-9 h-9 grid place-items-center rounded-full bg-ink/5 hover:bg-brand-red hover:text-white transition-all duration-200 hover:-translate-y-0.5">
                <Youtube size={16} />
              </a>
            )}
            {settings.tiktok_url && (
              <a href={settings.tiktok_url} target="_blank" rel="noreferrer" className="w-9 h-9 grid place-items-center rounded-full bg-ink/5 hover:bg-ink hover:text-white transition-all duration-200 hover:-translate-y-0.5">
                <TikTokIcon size={15} />
              </a>
            )}
          </div>
          {settings.contact_phone && <p className="text-sm mt-4">{settings.contact_phone}</p>}
          {settings.contact_email && <p className="text-sm">{settings.contact_email}</p>}
        </div>
      </div>
      <div className="border-t border-ink/10 py-5 text-center text-xs text-ink/40">
        © {new Date().getFullYear()} ProFixSAI. All rights reserved.
      </div>
    </footer>
  );
}

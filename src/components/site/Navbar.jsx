import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Facebook, Youtube, MapPin } from "lucide-react";
import { useSettings, getMapUrl } from "../../lib/useSettings.js";
import Logotype from "./Logotype.jsx";
import TikTokIcon from "./TikTokIcon.jsx";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/repair-process", label: "Repair Process" },
  { to: "/contact", label: "Contact" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const settings = useSettings();
  const mapUrl = getMapUrl(settings);

  useEffect(() => setOpen(false), []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-ink/10 shadow-sm">
      <div className="container-page flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/assets/logo.png" alt="ProFixSAI logo" className="w-9 h-9 rounded-full object-cover" />
          <Logotype size="lg" light subtitle />
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-ink/70">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `relative py-1.5 transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-brand-red after:transition-all after:duration-300 ${
                  isActive ? "text-ink after:w-full" : "hover:text-ink after:w-0 hover:after:w-full"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {settings.facebook_url && (
            <a href={settings.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-ink/40 hover:text-brand-blue transition-colors duration-200 hover:scale-110">
              <Facebook size={18} />
            </a>
          )}
          {settings.youtube_url && (
            <a href={settings.youtube_url} target="_blank" rel="noreferrer" aria-label="YouTube" className="text-ink/40 hover:text-brand-red transition-colors duration-200 hover:scale-110">
              <Youtube size={18} />
            </a>
          )}
          {settings.tiktok_url && (
            <a href={settings.tiktok_url} target="_blank" rel="noreferrer" aria-label="TikTok" className="text-ink/40 hover:text-ink transition-colors duration-200 hover:scale-110">
              <TikTokIcon size={17} />
            </a>
          )}
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Find our shop on the map"
              title="Find us"
              className="text-ink/40 hover:text-brand-blue transition-colors duration-200 hover:scale-110"
            >
              <MapPin size={18} />
            </a>
          )}
          <Link to="/book-a-repair" className="btn-primary hover:shadow-lg hover:shadow-brand-red/30 hover:-translate-y-0.5">Book a Repair</Link>
        </div>

        <button className="md:hidden text-ink" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink/10 bg-white px-5 pb-5 pt-2 flex flex-col gap-4 text-ink/75">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)} className="py-1">
              {l.label}
            </NavLink>
          ))}
          <div className="flex items-center gap-4 pt-2 border-t border-ink/10">
            {settings.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noreferrer"><Facebook size={20} /></a>}
            {settings.youtube_url && <a href={settings.youtube_url} target="_blank" rel="noreferrer"><Youtube size={20} /></a>}
            {settings.tiktok_url && <a href={settings.tiktok_url} target="_blank" rel="noreferrer"><TikTokIcon size={19} /></a>}
            {mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer" aria-label="Find our shop on the map"><MapPin size={20} /></a>}
          </div>
          <Link to="/book-a-repair" onClick={() => setOpen(false)} className="btn-primary w-full">Book a Repair</Link>
        </div>
      )}
    </header>
  );
}

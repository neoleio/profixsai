import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Facebook, Youtube, MapPin } from "lucide-react";
import { useSettings, getMapUrl } from "../../lib/useSettings.js";
import Logotype from "./Logotype.jsx";
import TikTokIcon from "./TikTokIcon.jsx";
import { useContent } from "../../lib/useContent.js";
import T from "./T.jsx";

const LINKS = [
  { to: "/", id: "nav_home" },
  { to: "/services", id: "nav_services" },
  { to: "/about", id: "nav_about" },
  { to: "/repair-process", id: "nav_process" },
  { to: "/contact", id: "nav_contact" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const settings = useSettings();
  const mapUrl = getMapUrl(settings);
  const { t, s } = useContent();

  useEffect(() => setOpen(false), []);

  return (
    <header style={s("nav_bg")} className="sticky top-0 z-40 bg-fog-100/95 backdrop-blur border-b border-ink/10 shadow-sm">
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
              <T id={l.id} />
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
          <Link to="/book-a-repair" style={s("nav_book")} className="btn-primary hover:shadow-lg hover:shadow-brand-red/30 hover:-translate-y-0.5">{t("nav_book")}</Link>
        </div>

        <button
          className="md:hidden grid h-10 w-10 place-items-center rounded-lg text-ink hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            className="md:hidden border-t border-ink/10 bg-fog-100 px-5 pb-5 pt-2 flex flex-col gap-4 text-ink/75 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `relative py-2 pl-3 transition-colors before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:rounded-full before:transition-colors ${
                    isActive ? "text-ink font-semibold before:bg-brand-red" : "hover:text-ink before:bg-transparent"
                  }`
                }
              >
                <T id={l.id} />
              </NavLink>
            ))}
            <div className="flex items-center gap-4 pt-2 border-t border-ink/10">
              {settings.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noreferrer"><Facebook size={20} /></a>}
              {settings.youtube_url && <a href={settings.youtube_url} target="_blank" rel="noreferrer"><Youtube size={20} /></a>}
              {settings.tiktok_url && <a href={settings.tiktok_url} target="_blank" rel="noreferrer"><TikTokIcon size={19} /></a>}
              {mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer" aria-label="Find our shop on the map"><MapPin size={20} /></a>}
            </div>
            <Link to="/book-a-repair" onClick={() => setOpen(false)} style={s("nav_book")} className="btn-primary w-full">{t("nav_book")}</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

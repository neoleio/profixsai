import { useEffect, useState } from "react";
import { api } from "./api.js";

const defaults = {
  facebook_url: "",
  youtube_url: "",
  tiktok_url: "",
  map_url: "",
  operating_hours: "Mon–Sat: 9:00 AM – 6:00 PM\nSun: Closed",
  hero_headline: "Fast & Reliable Gadget Repair",
  hero_subtext: "Professional repair services for smartphones, laptops, tablets, and other electronic devices.",
  contact_phone: "",
  contact_email: "",
  contact_address: ""
};

// Admins sometimes paste a URL without "http(s)://" (e.g. "youtube.com/@shop").
// Without a protocol, an <a href> is treated as a relative link on our own
// site instead of an external one — so normalize it here, once, for every
// consumer of these settings.
function withProtocol(url) {
  if (!url) return url;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function normalize(settings) {
  return {
    ...settings,
    facebook_url: withProtocol(settings.facebook_url),
    youtube_url: withProtocol(settings.youtube_url),
    tiktok_url: withProtocol(settings.tiktok_url),
    map_url: withProtocol(settings.map_url)
  };
}

// ---- Shared store -----------------------------------------------------------
// One network request feeds every component (Navbar, Footer, pages…), and the
// last response is kept in localStorage so returning visitors see the admin's
// custom text/colors on first paint instead of a flash of the defaults.
const STORAGE_KEY = "profixsai_settings_v1";
const listeners = new Set();
let cache = readStored();
let started = false;
let inflight = null;

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalize({ ...defaults, ...JSON.parse(raw) }) : null;
  } catch {
    return null;
  }
}

function writeStored(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* storage full or blocked — not critical */
  }
}

function load() {
  if (inflight) return inflight;
  inflight = api
    .get("/settings")
    .then(({ settings }) => {
      cache = normalize({ ...defaults, ...settings });
      writeStored(settings);
      listeners.forEach((fn) => fn());
    })
    .catch(() => {})
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useSettings() {
  const [, rerender] = useState(0);

  useEffect(() => {
    const fn = () => rerender((n) => n + 1);
    listeners.add(fn);
    if (!started) {
      started = true;
      load();
    }
    return () => listeners.delete(fn);
  }, []);

  return cache || normalize(defaults);
}

// Called after the admin saves — refetches so the public site (and any open
// preview) picks up the change right away.
export function invalidateSettingsCache() {
  started = true;
  load();
}

// A "map" button should work whether or not the admin has pasted a specific
// Google Maps link — fall back to a search query built from the shop address
// so the button is still useful the moment an address is set.
export function getMapUrl(settings) {
  if (settings.map_url) return settings.map_url;
  if (settings.contact_address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.contact_address)}`;
  }
  return null;
}

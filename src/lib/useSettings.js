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

let cache = null;

export function useSettings() {
  const [settings, setSettings] = useState(cache || defaults);

  useEffect(() => {
    if (cache) return;
    api.get("/settings").then(({ settings }) => {
      cache = normalize({ ...defaults, ...settings });
      setSettings(cache);
    }).catch(() => {});
  }, []);

  return settings;
}

export function invalidateSettingsCache() {
  cache = null;
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

import { useSettings } from "./useSettings.js";
import { resolveText, resolveStyle } from "./siteContent.js";

// t("hero_headline") → the wording to show (admin override or default)
// s("hero_headline") → inline style with the admin's text/background colors
export function useContent() {
  const settings = useSettings();
  return {
    settings,
    t: (id) => resolveText(settings, id),
    s: (id) => resolveStyle(settings, id)
  };
}

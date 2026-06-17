import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PALETTES, TYPOGRAPHIES, WEIGHTS, DEVICES, HOWITWORKS_LAYOUTS, DEFAULTS, byId } from "./themes";

const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

const LS = {
  palette: "nv_palette",
  typography: "nv_type",
  weight: "nv_weight",
  italic: "nv_italic",
  howItWorks: "nv_hiw",
  studio: "nv_studio_unlocked",
};

const read = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v == null ? fallback : v;
  } catch {
    return fallback;
  }
};

/**
 * Reads the URL once for two purposes:
 *  - `?preview=1`  → we're inside the Design Studio's device iframe; hide the
 *                    launcher and never recurse.
 *  - `?studio` / `?studio=1` / `?studio=0` → unlock / lock the studio on THIS
 *                    device only (persisted to localStorage). Public visitors
 *                    never see the launcher.
 */
function readUrlFlags() {
  if (typeof window === "undefined") return { isPreview: false, studioParam: null };
  const p = new URLSearchParams(window.location.search);
  const studioParam = p.has("studio") ? p.get("studio") || "1" : null;
  return { isPreview: p.has("preview"), studioParam };
}

export default function ThemeProvider({ children }) {
  const urlFlags = useMemo(readUrlFlags, []);

  const [paletteId, setPaletteId] = useState(() => read(LS.palette, DEFAULTS.palette));
  const [typographyId, setTypographyId] = useState(() => read(LS.typography, DEFAULTS.typography));
  const [weightId, setWeightId] = useState(() => read(LS.weight, DEFAULTS.weight));
  const [italic, setItalic] = useState(() => read(LS.italic, String(DEFAULTS.italic)) === "true");
  const [howItWorksId, setHowItWorksId] = useState(() => read(LS.howItWorks, DEFAULTS.howItWorks));
  const [device, setDevice] = useState(DEFAULTS.device); // device preview is session-only
  const [studioOpen, setStudioOpen] = useState(false);

  // The Design Studio launcher is visible to EVERYONE. Any palette/typography
  // change a visitor makes is saved to *their* localStorage only — it never
  // affects the live site for anyone else. (?studio=0 hides the launcher.)
  const [studioUnlocked, setStudioUnlocked] = useState(() => urlFlags.studioParam !== "0");

  const isPreview = urlFlags.isPreview;

  const palette = byId(PALETTES, paletteId);
  const typography = byId(TYPOGRAPHIES, typographyId);
  const weight = byId(WEIGHTS, weightId);

  // Persist the studio unlock the first time it's toggled via URL.
  useEffect(() => {
    if (urlFlags.studioParam != null) {
      try {
        localStorage.setItem(LS.studio, String(urlFlags.studioParam !== "0"));
      } catch {}
    }
  }, [urlFlags.studioParam]);

  // A keyboard escape hatch to reveal the studio on your own device:
  // press  g then s  (no input focused).
  useEffect(() => {
    let last = 0;
    const onKey = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || e.target?.isContentEditable) return;
      const now = Date.now();
      if (e.key === "g") last = now;
      else if (e.key === "s" && now - last < 600) {
        setStudioUnlocked(true);
        setStudioOpen(true);
        try { localStorage.setItem(LS.studio, "true"); } catch {}
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Apply the active theme to the document as CSS custom properties.
  useEffect(() => {
    const root = document.documentElement;
    const apply = (obj) => Object.entries(obj).forEach(([k, v]) => root.style.setProperty(k, v));
    apply(palette.vars);
    apply(typography.vars);
    apply(weight.vars);
    root.setAttribute("data-palette", palette.id);
    root.setAttribute("data-type", typography.id);
    root.setAttribute("data-italic", italic ? "true" : "false");
  }, [palette, typography, weight, italic]);

  const setPalette = (id) => { setPaletteId(id); try { localStorage.setItem(LS.palette, id); } catch {} };
  const setTypography = (id) => { setTypographyId(id); try { localStorage.setItem(LS.typography, id); } catch {} };
  const setWeight = (id) => { setWeightId(id); try { localStorage.setItem(LS.weight, id); } catch {} };
  const setItalicPersisted = (v) => { setItalic(v); try { localStorage.setItem(LS.italic, String(v)); } catch {} };
  const setHowItWorks = (id) => { setHowItWorksId(id); try { localStorage.setItem(LS.howItWorks, id); } catch {} };

  const value = {
    palette, typography, weight, italic, howItWorks: howItWorksId,
    device, studioOpen, studioUnlocked, isPreview,
    palettes: PALETTES, typographies: TYPOGRAPHIES, weights: WEIGHTS, devices: DEVICES, howItWorksLayouts: HOWITWORKS_LAYOUTS,
    setPalette, setTypography, setWeight, setItalic: setItalicPersisted, setHowItWorks,
    setDevice, setStudioOpen, setStudioUnlocked,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const PALETTES = [
  {
    id: "slate",
    name: "Health & Luxury",
    tagline: "Deep navy + champagne gold · quiet luxury",
    swatch: ["#22344F", "#B0A584", "#CFCBC0", "#E4E2DC", "#FBFAF6"],
    vars: {
      "--nv-bg": "#F4F3EF",
      "--nv-surface": "#FFFFFF",
      "--nv-surface-2": "#EFEEE8",
      "--nv-ink": "#22344F",
      "--nv-ink-panel": "#22344F",
      "--nv-primary": "#22344F",
      "--nv-primary-deep": "#1A2A42",
      "--nv-accent": "#B0A584",
      "--nv-line": "#E4E2DC",
      "--nv-line-strong": "#D6D2C8",
      "--nv-muted": "#5E6573",
      "--nv-on-primary": "#FBFAF6",
      "--nv-on-panel": "#E4E2DC",
    },
  },
  {
    id: "brass",
    name: "Cream & Brass",
    tagline: "Warm paper + brass · old-money editorial",
    swatch: ["#1B242E", "#2B3744", "#B0803C", "#E5E2D9", "#F1EFE9"],
    vars: {
      "--nv-bg": "#F1EFE9",
      "--nv-surface": "#FBFAF6",
      "--nv-surface-2": "#EFEADF",
      "--nv-ink": "#20262C",
      "--nv-ink-panel": "#1B242E",
      "--nv-primary": "#9A6E32",
      "--nv-primary-deep": "#7E5926",
      "--nv-accent": "#B0803C",
      "--nv-line": "#E5E2D9",
      "--nv-line-strong": "#D8CFBC",
      "--nv-muted": "#6A6256",
      "--nv-on-primary": "#FBF7EF",
      "--nv-on-panel": "#ECE5D8",
    },
  },
  {
    id: "aubergine",
    name: "Aubergine & Platinum",
    tagline: "Moody · modern · regal",
    swatch: ["#241726", "#4A2E4E", "#7A5C7E", "#B8A9BE", "#E9E4EC"],
    vars: {
      "--nv-bg": "#F4F0F6",
      "--nv-surface": "#FBF8FC",
      "--nv-surface-2": "#ECE5F0",
      "--nv-ink": "#241726",
      "--nv-ink-panel": "#241726",
      "--nv-primary": "#4A2E4E",
      "--nv-primary-deep": "#321F35",
      "--nv-accent": "#7A5C7E",
      "--nv-line": "#E6DEEA",
      "--nv-line-strong": "#D6C9DC",
      "--nv-muted": "#6E5F72",
      "--nv-on-primary": "#F3ECF5",
      "--nv-on-panel": "#E9E4EC",
    },
  },
  {
    id: "camel",
    name: "Camel & Cream",
    tagline: "Quiet 'old money' neutrals",
    swatch: ["#7A6248", "#A88B66", "#C9B596", "#E6DAC6", "#F7F2E9"],
    vars: {
      "--nv-bg": "#F7F2E9",
      "--nv-surface": "#FFFDF8",
      "--nv-surface-2": "#F0E7D6",
      "--nv-ink": "#3D3023",
      "--nv-ink-panel": "#2A2117",
      "--nv-primary": "#7A6248",
      "--nv-primary-deep": "#5E4A35",
      "--nv-accent": "#A88B66",
      "--nv-line": "#E9DEC9",
      "--nv-line-strong": "#DACBB0",
      "--nv-muted": "#7C6E58",
      "--nv-on-primary": "#F9F4EA",
      "--nv-on-panel": "#EFE6D5",
    },
  },
  {
    id: "graphite",
    name: "Graphite & Chrome",
    tagline: "Sleek tech luxe",
    swatch: ["#15171A", "#2C3036", "#565C64", "#9AA1A9", "#E4E7EA"],
    vars: {
      "--nv-bg": "#F4F5F7",
      "--nv-surface": "#FFFFFF",
      "--nv-surface-2": "#EBEDF0",
      "--nv-ink": "#15171A",
      "--nv-ink-panel": "#15171A",
      "--nv-primary": "#2C3036",
      "--nv-primary-deep": "#15171A",
      "--nv-accent": "#565C64",
      "--nv-line": "#E2E5E9",
      "--nv-line-strong": "#CFD3D9",
      "--nv-muted": "#565C64",
      "--nv-on-primary": "#F4F5F7",
      "--nv-on-panel": "#E4E7EA",
    },
  },
];


export const TYPOGRAPHIES = [
  {
    id: "grotesk",
    name: "Grotesk Modern",
    sample: "Aa",
    note: "Hanken Grotesk · IBM Plex Mono",
    vars: {
      "--nv-font-display": "'Hanken Grotesk', system-ui, sans-serif",
      "--nv-font-body": "'Hanken Grotesk', system-ui, sans-serif",
      "--nv-font-mono": "'IBM Plex Mono', ui-monospace, monospace",
      "--nv-display-tracking": "-0.032em",
    },
  },
  {
    id: "luxe",
    name: "Luxe Sans",
    sample: "Aa",
    note: "Poppins · Montserrat",
    vars: {
      "--nv-font-display": "'Poppins', system-ui, sans-serif",
      "--nv-font-body": "'Montserrat', system-ui, sans-serif",
      "--nv-font-mono": "'Montserrat', ui-monospace, monospace",
      "--nv-display-tracking": "-0.03em",
    },
  },
  {
    id: "editorial",
    name: "Editorial Serif",
    sample: "Aa",
    note: "Fraunces · Inter",
    vars: {
      "--nv-font-display": "'Fraunces', Georgia, 'Times New Roman', serif",
      "--nv-font-body": "'Inter', system-ui, sans-serif",
      "--nv-font-mono": "'IBM Plex Mono', ui-monospace, monospace",
      "--nv-display-tracking": "-0.02em",
    },
  },
  {
    id: "geometric",
    name: "Geometric Luxe",
    sample: "Aa",
    note: "Space Grotesk · Space Mono",
    vars: {
      "--nv-font-display": "'Space Grotesk', system-ui, sans-serif",
      "--nv-font-body": "'Space Grotesk', system-ui, sans-serif",
      "--nv-font-mono": "'Space Mono', ui-monospace, monospace",
      "--nv-display-tracking": "-0.03em",
    },
  },
  {
    id: "classic",
    name: "Classic Refined",
    sample: "Aa",
    note: "Playfair Display · DM Sans",
    vars: {
      "--nv-font-display": "'Playfair Display', Georgia, serif",
      "--nv-font-body": "'DM Sans', system-ui, sans-serif",
      "--nv-font-mono": "'IBM Plex Mono', ui-monospace, monospace",
      "--nv-display-tracking": "-0.02em",
    },
  },
  {
    id: "inter",
    name: "Clinical Inter",
    sample: "Aa",
    note: "Inter · IBM Plex Mono",
    vars: {
      "--nv-font-display": "'Inter', system-ui, sans-serif",
      "--nv-font-body": "'Inter', system-ui, sans-serif",
      "--nv-font-mono": "'IBM Plex Mono', ui-monospace, monospace",
      "--nv-display-tracking": "-0.02em",
    },
  },
  {
    id: "opensans",
    name: "Open Humanist",
    sample: "Aa",
    note: "Open Sans · IBM Plex Mono",
    vars: {
      "--nv-font-display": "'Open Sans', system-ui, sans-serif",
      "--nv-font-body": "'Open Sans', system-ui, sans-serif",
      "--nv-font-mono": "'IBM Plex Mono', ui-monospace, monospace",
      "--nv-display-tracking": "-0.015em",
    },
  },
  {
    id: "lato",
    name: "Friendly Lato",
    sample: "Aa",
    note: "Lato · IBM Plex Mono",
    vars: {
      "--nv-font-display": "'Lato', system-ui, sans-serif",
      "--nv-font-body": "'Lato', system-ui, sans-serif",
      "--nv-font-mono": "'IBM Plex Mono', ui-monospace, monospace",
      "--nv-display-tracking": "-0.015em",
    },
  },
  {
    id: "roboto",
    name: "Roboto",
    sample: "Aa",
    note: "Roboto · Roboto Mono",
    vars: {
      "--nv-font-display": "'Roboto', system-ui, sans-serif",
      "--nv-font-body": "'Roboto', system-ui, sans-serif",
      "--nv-font-mono": "'Roboto Mono', ui-monospace, monospace",
      "--nv-display-tracking": "-0.02em",
    },
  },
  {
    id: "arial",
    name: "Arial",
    sample: "Aa",
    note: "Arial · system mono",
    vars: {
      "--nv-font-display": "Arial, Helvetica, sans-serif",
      "--nv-font-body": "Arial, Helvetica, sans-serif",
      "--nv-font-mono": "ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace",
      "--nv-display-tracking": "-0.01em",
    },
  },
  {
    id: "nunito",
    name: "Friendly Nunito",
    sample: "Aa",
    note: "Nunito · IBM Plex Mono",
    vars: {
      "--nv-font-display": "'Nunito', system-ui, sans-serif",
      "--nv-font-body": "'Nunito', system-ui, sans-serif",
      "--nv-font-mono": "'IBM Plex Mono', ui-monospace, monospace",
      "--nv-display-tracking": "-0.015em",
    },
  },
  {
    id: "manrope",
    name: "Modern Manrope",
    sample: "Aa",
    note: "Manrope · IBM Plex Mono",
    vars: {
      "--nv-font-display": "'Manrope', system-ui, sans-serif",
      "--nv-font-body": "'Manrope', system-ui, sans-serif",
      "--nv-font-mono": "'IBM Plex Mono', ui-monospace, monospace",
      "--nv-display-tracking": "-0.02em",
    },
  },
  {
    id: "worksans",
    name: "Clean Work Sans",
    sample: "Aa",
    note: "Work Sans · IBM Plex Mono",
    vars: {
      "--nv-font-display": "'Work Sans', system-ui, sans-serif",
      "--nv-font-body": "'Work Sans', system-ui, sans-serif",
      "--nv-font-mono": "'IBM Plex Mono', ui-monospace, monospace",
      "--nv-display-tracking": "-0.018em",
    },
  },
  {
    id: "sourcesans",
    name: "Source Humanist",
    sample: "Aa",
    note: "Source Sans 3 · IBM Plex Mono",
    vars: {
      "--nv-font-display": "'Source Sans 3', system-ui, sans-serif",
      "--nv-font-body": "'Source Sans 3', system-ui, sans-serif",
      "--nv-font-mono": "'IBM Plex Mono', ui-monospace, monospace",
      "--nv-display-tracking": "-0.015em",
    },
  },
  {
    id: "jakarta",
    name: "Premium Jakarta",
    sample: "Aa",
    note: "Plus Jakarta Sans · IBM Plex Mono",
    vars: {
      "--nv-font-display": "'Plus Jakarta Sans', system-ui, sans-serif",
      "--nv-font-body": "'Plus Jakarta Sans', system-ui, sans-serif",
      "--nv-font-mono": "'IBM Plex Mono', ui-monospace, monospace",
      "--nv-display-tracking": "-0.02em",
    },
  },
  {
    id: "mulish",
    name: "Light Mulish",
    sample: "Aa",
    note: "Mulish · IBM Plex Mono",
    vars: {
      "--nv-font-display": "'Mulish', system-ui, sans-serif",
      "--nv-font-body": "'Mulish', system-ui, sans-serif",
      "--nv-font-mono": "'IBM Plex Mono', ui-monospace, monospace",
      "--nv-display-tracking": "-0.015em",
    },
  },
];

/** Letter-spacing presets (studio) — space between letters. */
export const LETTER_SPACINGS = [
  { id: "tight", name: "Tight", vars: { "--nv-letter-spacing": "-0.02em" } },
  { id: "normal", name: "Normal", vars: { "--nv-letter-spacing": "0em" } },
  { id: "wide", name: "Wide", vars: { "--nv-letter-spacing": "0.03em" } },
];

/** Line-height presets (studio) — space between lines. */
export const LINE_HEIGHTS = [
  { id: "snug", name: "Snug", vars: { "--nv-line-height": "1.4" } },
  { id: "normal", name: "Normal", vars: { "--nv-line-height": "1.6" } },
  { id: "relaxed", name: "Relaxed", vars: { "--nv-line-height": "1.85" } },
];

/** Heading / body weight presets toggled in the studio (Light · Medium · Bold). */
export const WEIGHTS = [
  { id: "light", name: "Light", vars: { "--nv-weight-heading": "600", "--nv-weight-body": "400" } },
  { id: "medium", name: "Medium", vars: { "--nv-weight-heading": "700", "--nv-weight-body": "450" } },
  { id: "bold", name: "Bold", vars: { "--nv-weight-heading": "800", "--nv-weight-body": "500" } },
];

/** Device preview frames (px) used by the studio's responsive viewer. */
export const DEVICES = [
  { id: "live", name: "Live", icon: "monitor", w: null, h: null },
  { id: "phone", name: "Phone", icon: "smartphone", w: 390, h: 844 },
  { id: "tablet", name: "Tablet", icon: "tablet", w: 834, h: 1112 },
  { id: "desktop", name: "Desktop", icon: "monitor", w: 1280, h: 800 },
  { id: "kiosk", name: "Kiosk", icon: "monitor-speaker", w: 1080, h: 1920 },
];

export const DEFAULTS = {
  palette: "slate",
  typography: "grotesk",
  weight: "medium",
  italic: false,
  letterSpacing: "normal",
  lineHeight: "normal",
  device: "live",
};

export const byId = (list, id) => list.find((x) => x.id === id) || list[0];

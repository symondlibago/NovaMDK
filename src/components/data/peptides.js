import { productsData } from "./products";

/**
 * "Explore Peptides" — the 11 LUVIRA peptide molecules, surfaced on the RX /
 * treatments side. Each molecule is derived from the supplements catalog
 * (grouped by `subCategorySlug`). The patient browses molecules here, then
 * flows into the standard product page → "Start your visit" telehealth RX
 * intake (the same MD Integrations questionnaire flow every Rx treatment uses).
 *
 * To add/remove a peptide, edit the product entries in products.jsx — this list
 * regenerates from them automatically.
 */

// Display order (weight/metabolic first, then recovery · longevity · skin).
const ORDER = [
  "semaglutide", "tirzepatide", "retatrutide", "bpc-157", "nad",
  "ghk-cu", "thymosin-alpha-1", "mots-c", "igf-1-lr3", "tesamorelin", "glow-blend",
];

// Short benefit tag shown on each molecule card.
const TAGS = {
  "semaglutide": "GLP-1 · Weight & metabolism",
  "tirzepatide": "GLP-1 / GIP · Weight & metabolism",
  "retatrutide": "GLP-3 · Next-gen weight",
  "bpc-157": "Recovery & tissue repair",
  "nad": "Cellular energy & longevity",
  "ghk-cu": "Skin, hair & collagen",
  "thymosin-alpha-1": "Immune support",
  "mots-c": "Mitochondrial & metabolic",
  "igf-1-lr3": "Lean muscle & recovery",
  "tesamorelin": "GH support · Visceral fat",
  "glow-blend": "Skin & repair blend",
};

export function getPeptides() {
  const groups = new Map();
  for (const p of productsData) {
    if (p.categorySlug !== "supplements" || !p.subCategorySlug) continue;
    if (!groups.has(p.subCategorySlug)) {
      groups.set(p.subCategorySlug, {
        slug: p.subCategorySlug,
        name: p.subCategoryName,
        tag: TAGS[p.subCategorySlug] || "Peptide therapy",
        img: p.img,
        rep: p,          // representative = first (lowest) strength in the catalog
        strengths: [],
      });
    }
    groups.get(p.subCategorySlug).strengths.push(p);
  }
  // Apply the preferred order, then append anything not explicitly listed.
  const ordered = [];
  for (const slug of ORDER) {
    if (groups.has(slug)) { ordered.push(groups.get(slug)); groups.delete(slug); }
  }
  return [...ordered, ...groups.values()];
}

export const PEPTIDES = getPeptides();

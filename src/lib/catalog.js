import { visibleProducts } from "../components/data/products";
import { CONSULTS, CONSULT_ORDER } from "../components/data/consultations";

const CATEGORY_LABEL = Object.fromEntries(
  CONSULT_ORDER.map((k) => [CONSULTS[k].goalSlug, CONSULTS[k].short || CONSULTS[k].name])
);

/**
 * Visible products grouped by category, ordered the way the nav orders goals,
 * with any category the consult list doesn't cover appended after those.
 * @returns {{slug: string, label: string, href: string, products: object[]}[]}
 */
export function groupedCatalog() {
  const groups = new Map();
  for (const p of visibleProducts) {
    if (!groups.has(p.categorySlug)) groups.set(p.categorySlug, []);
    groups.get(p.categorySlug).push(p);
  }
  const ordered = CONSULT_ORDER.map((k) => CONSULTS[k].goalSlug).filter((s) => groups.has(s));
  const rest = [...groups.keys()].filter((s) => !ordered.includes(s));
  return [...ordered, ...rest].map((slug) => ({
    slug,
    label: CATEGORY_LABEL[slug] || groups.get(slug)[0].categoryName,
    href: `/treatments/${slug}`,
    products: groups.get(slug),
  }));
}

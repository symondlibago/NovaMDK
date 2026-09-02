import { productsData } from "../components/data/products";
import { displayTitle } from "./catalog";
import { productPath } from "./slug";

/* MDI tells us which questionnaire a visit came from; our catalogue is keyed by
 * the same id. That's the join that lets the portal show a real treatment name
 * and photo instead of "Visit #2".
 *
 * Several dose rungs share one questionnaire (Starter / Mid-Dose / Maintenance
 * all point at the same intake), so the first match wins — they share artwork
 * and a base name anyway, and MDI doesn't tell us which rung was dispensed. */
const byQuestionnaire = new Map();
for (const p of productsData) {
  if (p.questionnaireId && !byQuestionnaire.has(p.questionnaireId)) {
    byQuestionnaire.set(p.questionnaireId, p);
  }
}

/* Used when a visit predates the current catalogue, or came from a questionnaire
 * we never listed — real for older sandbox cases, and possible in production
 * whenever MDI retires an intake. */
export const FALLBACK_IMAGE = "/products/peptides.avif";

export function treatmentFor(questionnaireId, fallbackName = null) {
  const product = questionnaireId ? byQuestionnaire.get(questionnaireId) : null;
  return {
    name: product ? displayTitle(product) : fallbackName,
    category: product?.categoryName || null,
    image: product?.img || FALLBACK_IMAGE,
    path: product ? productPath(product) : "/treatments",
    known: Boolean(product),
  };
}

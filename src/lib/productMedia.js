/* Supporting photography for the product page, shared by the hero gallery and
   the editorial sections so one product never shows two different photo sets as
   you scroll down it.

   Keyed by ROLE rather than by position. An earlier version handed out a flat
   list and the sections took [0] and [1], which is how a stock clinician ended
   up illustrating "Inside Olympus Peak" — a photo of a doctor says nothing about
   what is in the tablet. Each slot now states what it is for:

     product — what the formulation is. Texture, lab, ingredient, never a person.
     visit   — the consultation itself. A clinician or a patient on a call fits
               here and only here.

   PLACEHOLDERS. Stock shots standing in until real product photography lands,
   deliberately neutral so nothing on a compounded-drug page implies an outcome.
   Swap the files in /public/products/gallery and this map stays as is. */

const G = (name) => `/products/gallery/${name}.jpg`;

// Every category shares the same "visit" shot: the consultation is the same
// consultation whichever treatment brought you here.
const VISIT = G("telehealth");

const CATEGORY_MEDIA = {
  "weight-loss": { product: G("nutrition"), visit: VISIT },
  "unisex-anti-aging-rx": { product: G("clinical"), visit: VISIT },
  "unisex-sports-medicine": { product: G("fitness"), visit: VISIT },
  "unisex-skin-health": { product: G("skincare"), visit: VISIT },
  // Men's health leans abstract on purpose: a person in this category's imagery
  // reads as a claim about them, so the product slot stays texture.
  "mens-health": { product: G("marble"), visit: VISIT },
};

const EMPTY = { product: "", visit: "" };

/**
 * Role-keyed media for a product's category, for the editorial sections only.
 * The hero gallery shows the product's own photography and nothing from here:
 * a stock shot in a thumbnail strip reads as another view of the vial.
 */
export const categoryMedia = (product) => CATEGORY_MEDIA[product?.categorySlug] || EMPTY;

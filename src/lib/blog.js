import posts from "../content/blog/posts.json";

/* The blog's data layer, and the ONLY file that knows where posts come from.
   Pages and components import from here and never touch the source.

   Posts are authored in GoHighLevel. Today this reads a checked-in JSON file of
   samples; the plan is a build-time sync step that pulls from GHL and writes that
   same JSON, so the contract below does not change when the real content lands.
   scripts/seo-routes.mjs parses the identical file under Node, which is why the
   source is JSON rather than a .js module: one shape, two consumers, no scraping.

   Post shape:
     slug, title, excerpt, description, date (YYYY-MM-DD), image, imageAlt,
     tags[], author { name, role }, ghlId, body[]

   Body blocks: { type: "p" | "h2" | "h3" | "quote" | "ul" | "image" | "cta" }
   Blocks rather than raw HTML on purpose. GHL's editor output would need
   sanitising before it could be injected, and blocks let our own typography own
   the rendering instead of inheriting a page builder's markup. */

const WORDS_PER_MINUTE = 220;

/** Rough read time in whole minutes, floored at 1. */
export function readTime(post) {
  const words = (post.body || []).reduce((n, b) => {
    if (b.text) return n + b.text.split(/\s+/).length;
    if (b.items) return n + b.items.join(" ").split(/\s+/).length;
    return n;
  }, 0);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** "2026-08-14" -> "August 14, 2026". Parsed as UTC so the date never shifts. */
export function formatDate(iso) {
  const [y, m, d] = String(iso || "").split("-").map(Number);
  if (!y || !m || !d) return "";
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

/** All posts, newest first. */
export function getPosts() {
  return [...posts].sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

/** One post by slug, or null. */
export function getPost(slug) {
  return posts.find((p) => p.slug === slug) || null;
}

/** Up to `limit` other posts, preferring ones that share a tag. */
export function relatedPosts(post, limit = 2) {
  const tags = new Set(post?.tags || []);
  const others = getPosts().filter((p) => p.slug !== post?.slug);
  const shared = others.filter((p) => (p.tags || []).some((t) => tags.has(t)));
  const rest = others.filter((p) => !shared.includes(p));
  return [...shared, ...rest].slice(0, limit);
}

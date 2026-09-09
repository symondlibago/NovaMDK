import { ghlConfigured, tagContact, updateContactFields } from "./_ghl.js";
import { blocked, verifyReleaseToken } from "./_guard.js";

const MILESTONES = {
  "intake-started": {
    tags: ["intake-started"],
  },
  "not-eligible": {
    tags: ["not-eligible"],
    fields: { eligibility_status: "not_eligible" },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (blocked(req, res)) return;

  if (!verifyReleaseToken(req.body?.release_token)) {
    console.warn("Rejected /api/ghl-journey: missing or expired release token");
    return res.status(403).json({ error: "Forbidden" });
  }

  const contactId = req.body?.contact_id;
  const milestone = MILESTONES[req.body?.milestone];
  if (!contactId || !milestone) {
    console.warn(`Rejected /api/ghl-journey: unknown milestone "${req.body?.milestone}"`);
    return res.status(400).json({ error: "contact_id and a known milestone are required" });
  }

  if (!ghlConfigured()) {
    console.warn("GHL env vars missing — skipping journey write.");
    return res.status(200).json({ ok: false, skipped: "not_configured" });
  }

  /* Settled independently: a failed field write shouldn't cost us the tag, and
     the tag is what the smart lists filter on. */
  const [tagged, updated] = await Promise.allSettled([
    tagContact(contactId, milestone.tags || []),
    updateContactFields(contactId, milestone.fields || {}),
  ]);

  for (const [what, result] of [["tags", tagged], ["fields", updated]]) {
    if (result.status === "rejected") {
      console.error(`GHL journey ${what} failed:`, result.reason?.message, result.reason?.details ?? "");
    }
  }

  // Never fail a patient's intake over a CRM write.
  return res.status(200).json({
    ok: tagged.status === "fulfilled" && updated.status === "fulfilled",
    milestone: req.body.milestone,
  });
}

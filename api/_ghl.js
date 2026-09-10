const BASE = process.env.GHL_API_BASE || "https://services.leadconnectorhq.com";
const TOKEN = process.env.GHL_API_TOKEN;
const LOCATION_ID = process.env.GHL_LOCATION_ID;
const VERSION = process.env.GHL_API_VERSION || "2021-07-28";

export const ghlConfigured = () => Boolean(TOKEN && LOCATION_ID);
export const FIELD = {
  TREATMENT: "treatment",
  SEX_AT_BIRTH: "sex_at_birth",
  EMAIL_ADDRESS: "email_address",
  // MDI's permanent id for the person. One per patient, never changes, so the
  // Contact is the only place it belongs.
  MDI_PATIENT_ID: "mdi_patient_id",
  // The newest encounter, mirrored onto the Contact so a list can show it
  // without opening the opportunity. The per-visit copy lives below.
  LATEST_MDI_ENCOUNTER_ID: "latest_mdi_encounter_id",
  MDI_ENCOUNTER_STATUS: "mdi_encounter_status",
  LAST_MDI_UPDATE_DATE: "last_mdi_update_date",
  /* ---- these two live on the Opportunity, not the Contact ---- */
  // One person can walk up to two different kiosks, and per-visit is the only
  // place that stays true.
  KIOSK_LOCATION: "kiosk_location",
  // The encounter this particular visit produced. Distinct from the Contact's
  // LATEST_MDI_ENCOUNTER_ID, which gets overwritten each visit — this one is
  // the permanent record of which encounter belongs to which opportunity.
  MDI_ENCOUNTER_ID: "mdi_encounter_id",
};
const TREATMENT_FIELD_ID = "aUvylLMgR2BFDDjxKNm1";
const TREATMENT_SEPARATOR = "; ";
const TREATMENT_MAX_LENGTH = 500;
const SEX_AT_BIRTH = { 1: "Male", 2: "Female" };

async function ghlFetch(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Version: VERSION,
      Accept: "application/json",
      ...(body && { "Content-Type": "application/json" }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* error bodies aren't always JSON — fall through with the raw text */
  }

  if (!res.ok) {
    const err = new Error(data?.message || `GHL ${method} ${path} failed (${res.status})`);
    err.status = res.status;
    err.details = data ?? text;
    throw err;
  }
  return data;
}

/* GHL stores phone numbers in E.164; the intake modal collects them free-form. */
function toE164(raw) {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (trimmed.startsWith("+")) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits ? `+${digits}` : null;
}

const clean = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);

// GET responses spell it `value`, upsert responses spell it `fieldValue`.
const treatmentOf = (contact) =>
  clean(
    (contact?.customFields || []).find((f) => f.id === TREATMENT_FIELD_ID)
      ?.value ??
      (contact?.customFields || []).find((f) => f.id === TREATMENT_FIELD_ID)
        ?.fieldValue
  );

// Append `next` unless it's already listed, dropping the oldest entries if the
// field would overflow.
function mergeTreatment(previous, next) {
  if (!next) return null;
  const list = previous ? previous.split(TREATMENT_SEPARATOR).map((s) => s.trim()).filter(Boolean) : [];
  if (list.includes(next)) return list.join(TREATMENT_SEPARATOR);
  list.push(next);
  while (list.length > 1 && list.join(TREATMENT_SEPARATOR).length > TREATMENT_MAX_LENGTH) list.shift();
  return list.join(TREATMENT_SEPARATOR);
}

/* Additive: GHL's tag endpoint appends rather than replacing, so a later
 * lifecycle tag never wipes the ones the lead arrived with. */
export async function tagContact(contactId, tags = []) {
  const wanted = tags.filter(Boolean);
  if (!contactId || !wanted.length) return null;
  await ghlFetch(`/contacts/${contactId}/tags`, { method: "POST", body: { tags: wanted } });
  return wanted;
}

/* Bare keys throughout. GHL's UI shows these wrapped as
 * `{{contact.some_key}}` / `{{opportunity.some_key}}` because that's the merge
 * syntax for emails and forms, but the API only accepts the unprefixed key. */
const customFieldList = (fields) =>
  Object.entries(fields)
    .filter(([, value]) => value != null && String(value).trim() !== "")
    .map(([key, value]) => ({ key, field_value: typeof value === "string" ? value.trim() : value }));

export async function updateContactFields(contactId, fields = {}) {
  const customFields = customFieldList(fields);
  if (!contactId || !customFields.length) return null;
  await ghlFetch(`/contacts/${contactId}`, { method: "PUT", body: { customFields } });
  return customFields;
}

/* `name` rides along because GHL treats it as required on an opportunity PUT.
 * Callers pass the same treatment the record was created with, so it reads as a
 * no-op rather than a rename. */
export async function updateOpportunityFields(opportunityId, fields = {}, { name } = {}) {
  const customFields = customFieldList(fields);
  if (!opportunityId || !customFields.length) return null;
  const data = await ghlFetch(`/opportunities/${opportunityId}`, {
    method: "PUT",
    body: { customFields, ...(clean(name) && { name: clean(name) }) },
  });
  return data?.opportunity || null;
}

export async function upsertContact({ patient = {}, treatment, tags = [], source, mdiPatientId } = {}) {
  const email = clean(patient.email);
  const phone = toE164(patient.phone_number);
  if (!email && !phone) throw new Error("A GHL contact needs at least an email or a phone number.");

  const address = patient.address || {};
  const customFields = [];
  const addField = (key, value) => value && customFields.push({ key, field_value: value });
  const nextTreatment = clean(treatment);
  addField(FIELD.SEX_AT_BIRTH, SEX_AT_BIRTH[Number(patient.gender)]);
  addField(FIELD.EMAIL_ADDRESS, email);
  // MDI hands this back with the voucher, which is minted moments before this
  // call. It stays blank when MDI couldn't match or create the patient.
  addField(FIELD.MDI_PATIENT_ID, clean(mdiPatientId));

  const body = {
    locationId: LOCATION_ID,
    country: "US",
    ...(email && { email }),
    ...(phone && { phone }),
    ...(clean(patient.first_name) && { firstName: clean(patient.first_name) }),
    ...(clean(patient.last_name) && { lastName: clean(patient.last_name) }),
    ...(clean(patient.date_of_birth) && { dateOfBirth: clean(patient.date_of_birth) }),
    ...(clean(address.address) && { address1: clean(address.address) }),
    ...(clean(address.city_name) && { city: clean(address.city_name) }),
    ...(clean(address.state_name) && { state: clean(address.state_name) }),
    ...(clean(address.zip_code) && { postalCode: clean(address.zip_code) }),
    ...(clean(source) && { source: clean(source) }),
    ...(customFields.length && { customFields }),
  };

  const data = await ghlFetch("/contacts/upsert", { method: "POST", body });
  const contact = data?.contact || null;

  if (phone && contact && !contact.phone) {
    console.warn(`GHL saved contact ${contact.id} without its phone — that number already belongs to another contact.`);
  }

  if (contact?.id && nextTreatment) {
    const previous = treatmentOf(contact);
    const merged = mergeTreatment(previous, nextTreatment);
    if (merged && merged !== previous) {
      try {
        await ghlFetch(`/contacts/${contact.id}`, {
          method: "PUT",
          body: { customFields: [{ key: FIELD.TREATMENT, field_value: merged }] },
        });
      } catch (e) {
        console.error("GHL treatment update failed:", e.message);
      }
    }
  }

  if (contact?.id) {
    try {
      await tagContact(contact.id, tags);
    } catch (e) {
      console.error("GHL tagging failed:", e.message);
    }
  }

  return contact;
}

const PIPELINE_NAME = process.env.GHL_PIPELINE_NAME || null;
const STAGE_NAME = process.env.GHL_STAGE_NAME || null;
const PAID_STAGE_NAME = process.env.GHL_PAID_STAGE_NAME || "Paid";

let pipelineCache = null;

async function resolvePipeline() {
  if (pipelineCache) return pipelineCache;
  const data = await ghlFetch(`/opportunities/pipelines?locationId=${LOCATION_ID}`);
  const pipelines = data?.pipelines || [];
  const pipeline =
    (PIPELINE_NAME && pipelines.find((p) => p.name?.toLowerCase() === PIPELINE_NAME.toLowerCase())) ||
    pipelines[0];
  if (!pipeline) throw new Error("No GHL pipeline exists for this location — create one in Opportunities.");

  const stages = pipeline.stages || [];
  const stage =
    (STAGE_NAME && stages.find((s) => s.name?.toLowerCase() === STAGE_NAME.toLowerCase())) || stages[0];
  if (!stage) throw new Error(`GHL pipeline "${pipeline.name}" has no stages.`);

  // `stages` is kept so later moves (e.g. to Paid) resolve without a second call.
  pipelineCache = {
    pipelineId: pipeline.id,
    stageId: stage.id,
    stages,
    pipelineName: pipeline.name,
    label: `${pipeline.name} / ${stage.name}`,
  };
  return pipelineCache;
}

export async function markOpportunityPaid(opportunityId) {
  if (!opportunityId) return null;

  const { stages, pipelineName } = await resolvePipeline();
  const paid = stages.find((s) => s.name?.toLowerCase() === PAID_STAGE_NAME.toLowerCase());
  if (!paid) {
    throw new Error(`GHL pipeline "${pipelineName}" has no "${PAID_STAGE_NAME}" stage.`);
  }

  const data = await ghlFetch(`/opportunities/${opportunityId}`, {
    method: "PUT",
    body: { pipelineStageId: paid.id },
  });
  return data?.opportunity || null;
}

/* One opportunity per visit, hanging off the single patient contact — this is
 * how repeat visits stay individually trackable without duplicating the person.
 * Deliberately separate from upsertContact: a patient who books twice is one
 * contact and two opportunities. */
export async function createVisitOpportunity({ contactId, treatment, value, source, kioskLocation, mdiEncounterId } = {}) {
  const name = clean(treatment);
  if (!contactId || !name) return null;

  const { pipelineId, stageId } = await resolvePipeline();
  const amount = Number(value) > 0 ? { monetaryValue: Number(value) } : null;
  const fields = customFieldList({
    [FIELD.KIOSK_LOCATION]: kioskLocation,
    [FIELD.MDI_ENCOUNTER_ID]: mdiEncounterId,
  });
  const custom = fields.length ? { customFields: fields } : null;

  try {
    const data = await ghlFetch("/opportunities/", {
      method: "POST",
      body: {
        locationId: LOCATION_ID,
        contactId,
        pipelineId,
        pipelineStageId: stageId,
        name,
        status: "open",
        ...amount,
        ...custom,
        ...(clean(source) && { source: clean(source) }),
      },
    });
    return { opportunity: data?.opportunity || null, created: true };
  } catch (e) {
    // Unless the location allows duplicates, GHL caps a contact at one
    // opportunity per pipeline — regardless of status, so closing the old one
    // doesn't help. Rather than drop the visit, roll the existing record
    // forward to the new treatment. Per-visit history still survives in the
    // contact's Treatment list and its notes timeline.
    const existingId = e.details?.meta?.existingId;
    if (e.details?.code !== "OPPORTUNITY_NO_DUPLICATE" || !existingId) throw e;

    // Roll the placement forward too: this record now represents the newer
    // visit, and that visit came from wherever this scan did.
    const data = await ghlFetch(`/opportunities/${existingId}`, {
      method: "PUT",
      body: { name, ...amount, ...custom, ...(clean(source) && { source: clean(source) }) },
    });
    return { opportunity: data?.opportunity || null, created: false };
  }
}

export async function addContactNote(contactId, note) {
  const body = clean(note);
  if (!contactId || !body) return null;
  return ghlFetch(`/contacts/${contactId}/notes`, { method: "POST", body: { body } });
}

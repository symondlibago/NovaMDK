import { blocked } from './_guard.js';
import { mdi, mdiUpload, mdiConfigured, listOf } from './_mdi.js';
import { readSession, sessionsEnabled } from './_session.js';

const MESSAGE_PAGE = 100;
const CHANNELS = new Set(['patient']);

/* MDI's own list of accepted upload types; anything else is rejected upstream. */
const UPLOAD_TYPE = (mime) => {
  if (String(mime).startsWith('image/')) return 'photo';
  if (String(mime).startsWith('audio/') || String(mime).startsWith('video/')) return 'av-video';
  return 'other';
};
const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;
const MIN_UPLOAD_BYTES = 1024;
const WRITABLE = [
  'first_name', 'last_name', 'phone_number', 'date_of_birth', 'gender',
  'weight', 'height', 'blood_pressure', 'body_temperature', 'oxygen_saturation',
  'current_medications', 'medical_conditions', 'allergies', 'pregnancy',
  'is_sms_enabled', 'is_email_enabled',
];
const ADDRESS_FIELDS = ['address', 'address2', 'zip_code', 'city_name', 'state_name'];

/** MDI stamps authorship as a PHP class name: App\Models\Patient, …\Clinician. */
const isPatient = (userType) => /\\Patient$/.test(String(userType || ''));

const shapeMessage = (m) => ({
  id: m.id,
  text: m.text || '',
  created_at: m.created_at,
  mine: isPatient(m.user_type),
  author: isPatient(m.user_type) ? null : m.user_name || 'Care team',
  read_at: m.read_at || null,
  files: (m.files || []).map((f) => ({
    id: f.file_id || f.id,
    name: f.name || f.file_name || 'Attachment',
    mime_type: f.mime_type || null,
  })),
});

const shapeProfile = (p) => ({
  patient_id: p.patient_id || p.id,
  first_name: p.first_name || '',
  last_name: p.last_name || '',
  email: p.email || '',
  phone_number: p.phone_number || '',
  date_of_birth: p.date_of_birth || '',
  gender: p.gender ?? null,
  gender_label: p.gender_label || null,
  weight: p.weight ?? null,
  height: p.height ?? null,
  blood_pressure: p.blood_pressure || '',
  body_temperature: p.body_temperature ?? null,
  oxygen_saturation: p.oxygen_saturation ?? null,
  current_medications: p.current_medications || '',
  medical_conditions: p.medical_conditions || '',
  allergies: p.allergies || '',
  pregnancy: Boolean(p.pregnancy),
  is_sms_enabled: p.is_sms_enabled !== false,
  is_email_enabled: p.is_email_enabled !== false,
  address: p.address
    ? {
        address: p.address.address || '',
        address2: p.address.address2 || '',
        zip_code: p.address.zip_code || '',
        city_name: p.address.city_name || '',
        // MDI nests the state on read but takes a flat name on write.
        state_name: p.address.state?.name || p.address.state_name || '',
      }
    : null,
});

const shapeCase = (c) => {
  const clinician = c.case_assignment?.clinician;
  return {
    case_id: c.case_id || c.id,
    created_at: c.created_at,
    case_type: c.case_type || null,
    status: c.case_status?.name || null,
    clinician: clinician ? `${clinician.first_name || ''} ${clinician.last_name || ''}`.trim() : null,
    specialty: clinician?.specialty || null,
    // Both arrays are what MDI shows as "Requested Treatment"; they stay empty
    // until an offering is attached to the case.
    treatments: [
      ...(c.case_prescriptions || []).map((rx) => ({
        id: rx.case_prescription_id || rx.id,
        name: rx.name || rx.medication_name || 'Prescription',
        detail: [rx.strength, rx.quantity && `Qty ${rx.quantity}`, rx.directions]
          .filter(Boolean).join(' · ') || null,
      })),
      ...(c.case_offerings || []).map((o) => ({
        id: o.case_offering_id || o.id,
        name: o.name || o.title || 'Treatment',
        detail: o.description || null,
      })),
    ],
  };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  // An open portal polls two threads, switches tabs and acknowledges reads;
  // several people behind one office NAT share this IP bucket too.
  if (blocked(req, res, { max: 240 })) return;

  if (!sessionsEnabled() || !mdiConfigured()) {
    return res.status(503).json({ error: 'Portal not configured' });
  }

  const patientId = readSession(req);
  if (!patientId) return res.status(401).json({ error: 'Not signed in' });

  const id = encodeURIComponent(patientId);
  const resource = req.body?.resource;

  try {
    if (resource === 'profile') {
      const r = await mdi(`/patients/${id}`);
      if (!r.ok) {
        console.error('Portal profile failed:', r.status);
        return res.status(502).json({ error: 'Could not load your profile' });
      }
      return res.status(200).json({ profile: shapeProfile(r.data?.data || r.data) });
    }

    if (resource === 'update_profile') {
      const patch = {};
      for (const key of WRITABLE) {
        if (req.body?.profile?.[key] !== undefined) patch[key] = req.body.profile[key];
      }
      if (req.body?.profile?.address) {
        patch.address = {};
        for (const key of ADDRESS_FIELDS) {
          if (req.body.profile.address[key] !== undefined) patch.address[key] = req.body.profile.address[key];
        }
      }
      if (!Object.keys(patch).length) return res.status(400).json({ error: 'Nothing to update' });

      const r = await mdi(`/patients/${id}`, { method: 'PATCH', body: patch });
      if (!r.ok) {
        console.error('Portal profile update failed:', r.status);
        return res.status(502).json({ error: 'Could not save your changes' });
      }
      return res.status(200).json({ profile: shapeProfile(r.data?.data || r.data) });
    }

    if (resource === 'cases') {
      const r = await mdi(`/patients/${id}/cases`);
      if (!r.ok) {
        console.error('Portal cases failed:', r.status);
        return res.status(502).json({ error: 'Could not load your visits' });
      }
      const cases = listOf(r.data)
        .map(shapeCase)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      // Numbered oldest-first so "Visit #1" stays #1 as new ones arrive.
      return res.status(200).json({ cases: cases.map((c, i) => ({ ...c, number: i + 1 })) });
    }

    if (resource === 'messages') {
      const channel = CHANNELS.has(req.body?.channel) ? req.body.channel : 'patient';
      const r = await mdi(`/patients/${id}/messages?channel=${channel}&per_page=${MESSAGE_PAGE}`);
      if (!r.ok) {
        console.error('Portal messages failed:', r.status);
        return res.status(502).json({ error: 'Could not load your messages' });
      }
      // MDI paginates newest-first; the thread reads oldest-first.
      const messages = listOf(r.data)
        .map(shapeMessage)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      return res.status(200).json({ messages });
    }

    if (resource === 'upload') {
      const { name, mime_type: mime, data } = req.body || {};
      if (!data) return res.status(400).json({ error: 'No file received' });

      const buf = Buffer.from(String(data), 'base64');
      if (!buf.length) return res.status(400).json({ error: 'That file could not be read' });
      if (buf.length < MIN_UPLOAD_BYTES) {
        return res.status(400).json({ error: 'That file is too small to send. The minimum is 1 KB.' });
      }
      if (buf.length > MAX_UPLOAD_BYTES) {
        return res.status(413).json({ error: 'That file is too large. The limit is 3 MB.' });
      }

      const filename = String(name || 'attachment').replace(/[/\\]/g, '_').slice(0, 120);
      const form = new FormData();
      form.append('name', filename);
      form.append('type', UPLOAD_TYPE(mime));
      form.append('file', new Blob([buf], { type: mime || 'application/octet-stream' }), filename);

      const r = await mdiUpload('/files', form);
      const fileId = r.data?.file_id || r.data?.id;
      if (!r.ok || !fileId) {
        console.error('Portal upload failed:', r.status);
        return res.status(502).json({ error: 'Could not upload that file' });
      }
      return res.status(200).json({ file: { id: fileId, name: r.data?.name || filename } });
    }

    if (resource === 'send_message') {
      const channel = CHANNELS.has(req.body?.channel) ? req.body.channel : 'patient';
      const text = String(req.body?.text || '').trim();
      const fileIds = Array.isArray(req.body?.file_ids)
        ? req.body.file_ids.filter((f) => typeof f === 'string').slice(0, 10)
        : [];
      if (!text && !fileIds.length) return res.status(400).json({ error: 'Message is empty' });
      if (text.length > 5000) return res.status(400).json({ error: 'Message is too long' });

      const r = await mdi(`/patients/${id}/messages`, {
        method: 'POST',
        body: {
          channel,
          text,
          sender_type: 'patient',
          ...(fileIds.length ? { files: fileIds.map((f) => ({ id: f })) } : {}),
        },
      });

      if (!r.ok) {
        console.error('Portal send failed:', r.status);
        return res.status(502).json({ error: 'Could not send your message' });
      }
      return res.status(200).json({ message: shapeMessage(r.data?.data || r.data) });
    }

    if (resource === 'read_message') {
      const messageId = String(req.body?.message_id || '');
      if (!messageId) return res.status(400).json({ error: 'message_id is required' });

      // Path-scoped to this patient, so a guessed id from another chart 404s.
      const r = await mdi(`/patients/${id}/messages/${encodeURIComponent(messageId)}/read`, {
        method: 'POST',
      });
      return res.status(r.ok ? 200 : 502).json({ read: r.ok });
    }

    if (resource === 'file') {
      const fileId = String(req.body?.file_id || '');
      if (!fileId) return res.status(400).json({ error: 'file_id is required' });

      const r = await mdi(`/files/${encodeURIComponent(fileId)}`);
      if (!r.ok) return res.status(502).json({ error: 'Could not open that attachment' });
      return res.status(200).json({ url: r.data?.url || null, name: r.data?.name || null });
    }


    return res.status(400).json({ error: 'Unknown resource' });
  } catch (error) {
    console.error('Portal error:', error.message);
    return res.status(500).json({ error: 'Internal error' });
  }
}

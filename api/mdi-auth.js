const CLIENT_ID = process.env.MDI_CLIENT_ID || "727bf2a9-ffa8-4aa6-8d10-23029907e8c9";
const CLIENT_SECRET = process.env.MDI_CLIENT_SECRET || "Nv9EG1YSJDbzAl3DC8WCkyZxwBkpXgrOBeSFy6SS";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // STEP 1: Authenticate with explicit keys
    const authResponse = await fetch('https://api.mdintegrations.com/v1/partner/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: "*"
      })
    });

    if (!authResponse.ok) {
      const errText = await authResponse.text();
      console.error("MDI Auth Rejected:", errText);
      return res.status(500).json({ error: "Auth Failed", details: errText });
    }
    
    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // STEP 2: Generate Voucher
    const voucherResponse = await fetch('https://api.mdintegrations.com/v1/partner/vouchers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}` 
      },
      body: JSON.stringify({
        hold_status: true,
        patient_id: null,
        questionnaire_id: req.body.questionnaire_id,
        case_offerings: [],
        disease: []
      })
    });

    if (!voucherResponse.ok) {
      const errText = await voucherResponse.text();
      console.error("MDI Voucher Rejected:", errText);
      return res.status(500).json({ error: "Voucher Failed", details: errText });
    }
    
    const voucherData = await voucherResponse.json();
    return res.status(200).json(voucherData);

  } catch (error) {
    console.error("Internal API Error:", error.message);
    return res.status(500).json({ error: 'Catch Block Triggered', details: error.message });
  }
}
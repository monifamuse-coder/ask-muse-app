export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  if (!apiKey || !formId) {
    console.error('Kit API key or Form ID not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    const { email, name } = req.body;

    const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        email: email,
        first_name: name || '',
        tags: [],
        fields: {
          source: 'muse_taster'
        }
      })
    });

    const data = await response.json();

    if (data.subscription) {
      return res.status(200).json({ success: true });
    } else {
      console.error('Kit API response:', data);
      return res.status(200).json({ success: true }); // Don't block the user even if Kit fails
    }
  } catch (error) {
    console.error('Kit API error:', error);
    return res.status(200).json({ success: true }); // Don't block the user
  }
}

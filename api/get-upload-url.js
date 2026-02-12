import { google } from 'googleapis';

export default async function handler(req, res) {
  // --------------------------------------------------------------------------
  // ✅ FIX 1: Browser ko permission do (CORS Headers)
  // --------------------------------------------------------------------------
  res.setHeader('Access-Control-Allow-Origin', '*'); // Sabko allow karein
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // OPTIONS method zaroori hai
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // --------------------------------------------------------------------------
  // ✅ FIX 2: Preflight (OPTIONS) request ko pass hone do
  // --------------------------------------------------------------------------
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Sirf POST request allow karo
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, mimeType, size } = req.body;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: name,
      mimeType: 'application/vnd.google-apps.presentation', 
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: mimeType,
      },
      fields: 'id',
    }, {
      url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
      method: 'POST',
      headers: {
        'X-Upload-Content-Type': mimeType,
        'X-Upload-Content-Length': size,
        'Origin': req.headers.origin || '*', // Ye aapne sahi lagaya tha
      }
    });

    // --------------------------------------------------------------------------
    // ✅ FIX 3: Safety Check - Kabhi kabhi Location header lowercase hota hai
    // --------------------------------------------------------------------------
    const uploadUrl = response.headers.location || response.headers.Location;
    
    if (!uploadUrl) {
        throw new Error("Google ne Upload URL return nahi kiya.");
    }

    res.status(200).json({ uploadUrl });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}

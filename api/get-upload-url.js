import { google } from 'googleapis';

export default async function handler(req, res) {
  // --------------------------------------------------------------------------
  // ✅ STEP 1: CORS Headers Setup (Browser ko permission do)
  // --------------------------------------------------------------------------
  res.setHeader('Access-Control-Allow-Origin', '*'); // Sabko allow karein
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // --------------------------------------------------------------------------
  // ✅ STEP 2: Handle Preflight (OPTIONS) Request
  // --------------------------------------------------------------------------
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // --------------------------------------------------------------------------
  // ✅ STEP 3: Validate Request Method
  // --------------------------------------------------------------------------
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, mimeType, size } = req.body;

    // ✅ FIX: Origin detect karein – agar browser nahi bhej raha to domain manually do
    const origin = req.headers.origin || 'https://pdf-tool-wheat.vercel.app';

    // Google Auth Setup
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // File Metadata – Google Slides banane ke liye
    const fileMetadata = {
      name: name,
      mimeType: 'application/vnd.google-apps.presentation',
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };

    // --------------------------------------------------------------------------
    // ✅ STEP 4: Create Resumable Upload Session
    // --------------------------------------------------------------------------
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
        // ✅ Google ko exact origin milega – kabhi bhi * nahi bhejenge
        'Origin': origin,
      }
    });

    // --------------------------------------------------------------------------
    // ✅ STEP 5: Safe URL Extraction
    // --------------------------------------------------------------------------
    const uploadUrl = response.headers.location || response.headers.Location;

    if (!uploadUrl) {
      throw new Error('Google API ne Upload URL return nahi kiya.');
    }

    // Success response
    res.status(200).json({ uploadUrl });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}

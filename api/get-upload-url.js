import { google } from 'googleapis';

export default async function handler(req, res) {
  // ---------------------------------------------------------
  // 1. CORS Headers (Browser ko permission dene ke liye)
  // ---------------------------------------------------------
  res.setHeader('Access-Control-Allow-Origin', '*'); // Production mein '*' ki jagah apna domain likh sakte hain
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight request (Browser checking options) handle karo
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Sirf POST request allow karo
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, mimeType, size } = req.body;

    // Google Auth (Robot Login)
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // 2. Google ko batao ki ek file aane wali hai (Metadata)
    const fileMetadata = {
      name: name,
      // Agar PPTX chahiye to ye mimeType rakhein, nahi to original rehne dein
      mimeType: 'application/vnd.google-apps.presentation', 
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], 
    };

    // 3. Resumable Upload Link maango (Session Create)
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: mimeType,
      },
      fields: 'id',
    }, {
      // Ye URL sirf session create karne ke liye hai
      url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
      method: 'POST',
      headers: {
        'X-Upload-Content-Type': mimeType,
        'X-Upload-Content-Length': size,
        // ✅ Ye sabse zaroori fix tha:
        'Origin': req.headers.origin || '*', 
      }
    });

    // 4. Link wapas frontend ko bhej do
    // Note: Google session URL 'location' header mein bhejta hai
    const uploadUrl = response.headers.location || response.headers.Location;
    
    if (!uploadUrl) {
      throw new Error("Google didn't return an upload URL.");
    }

    res.status(200).json({ uploadUrl });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}

import { google } from 'googleapis';

export default async function handler(req, res) {
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

    // 1. Google ko batao ki ek file aane wali hai
    const fileMetadata = {
      name: name,
      mimeType: 'application/vnd.google-apps.presentation', // Force convert to Slides
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Folder ID
    };

    // 2. Resumable Upload Link maango
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
      }
    });

    // 3. Link wapas frontend ko bhej do
    const uploadUrl = response.headers.location;
    res.status(200).json({ uploadUrl });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}

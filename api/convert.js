import { google } from 'googleapis';

// Vercel function ko thoda time do (Free plan limit: 10s, Pro: 60s)
export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileId } = req.body;
  if (!fileId) return res.status(400).json({ error: 'File ID missing' });

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // PDF Export Setup
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');

    // 1. Google Drive se PDF stream karo
    const result = await drive.files.export(
      {
        fileId: fileId,
        mimeType: 'application/pdf',
      },
      { responseType: 'stream' }
    );

    // 2. Stream ko user ke paas pipe karo
    result.data
      .on('end', async () => {
         // Cleanup: Kaam hone ke baad file delete kar do
         try {
            await drive.files.delete({ fileId: fileId });
         } catch (e) { console.error("Cleanup failed", e); }
      })
      .on('error', (err) => {
        console.error('Stream Error:', err);
      })
      .pipe(res);

  } catch (error) {
    console.error('Conversion Error:', error);
    res.status(500).json({ error: error.message });
  }
}

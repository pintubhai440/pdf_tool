import { google } from 'googleapis';

// Vercel Serverless Function Config
// Ye request ko jaldi timeout hone se rokega (60 seconds tak wait karega)
export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
  // --------------------------------------------------------------------------
  // ✅ STEP 1: CORS Headers (Browser ko permission do)
  // --------------------------------------------------------------------------
  res.setHeader('Access-Control-Allow-Origin', '*'); // Sabko allow karein
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // OPTIONS method zaroori hai
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // --------------------------------------------------------------------------
  // ✅ STEP 2: Handle Preflight (OPTIONS) Request
  // Browser pehle check karega, agar ye fail hua to conversion shuru hi nahi hoga
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

  const { fileId } = req.body;
  if (!fileId) {
    return res.status(400).json({ error: 'File ID missing' });
  }

  try {
    // Google Auth Setup
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // --------------------------------------------------------------------------
    // ✅ STEP 4: Setup Response Headers for PDF Download
    // --------------------------------------------------------------------------
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');

    // --------------------------------------------------------------------------
    // ✅ STEP 5: Export File (Convert to PDF) & Stream directly to User
    // --------------------------------------------------------------------------
    const result = await drive.files.export(
      {
        fileId: fileId,
        mimeType: 'application/pdf', // Force PDF export
      },
      { responseType: 'stream' } // Stream mode (server memory bachane ke liye)
    );

    // Stream ko user ke response mein pipe karo
    result.data
      .on('end', async () => {
         // ----------------------------------------------------------------------
         // ✅ STEP 6: Cleanup (Important)
         // Conversion ke baad original file delete karo taaki Drive full na ho
         // ----------------------------------------------------------------------
         try {
            await drive.files.delete({ fileId: fileId });
            console.log(`File ${fileId} deleted successfully.`);
         } catch (e) { 
            console.error("Cleanup failed:", e.message); 
         }
      })
      .on('error', (err) => {
        console.error('Stream Error:', err);
        // Note: Agar header bhejne ke baad error aata hai, toh hum JSON error nahi bhej sakte
        // isliye bas console log karte hain.
      })
      .pipe(res);

  } catch (error) {
    console.error('Conversion Error:', error);
    // Agar shuru mein hi error aa gaya to JSON bhej do
    if (!res.headersSent) {
        res.status(500).json({ error: error.message });
    }
  }
}

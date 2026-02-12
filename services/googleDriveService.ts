import { gapi } from 'gapi-script';

// 🔐 Keys are loaded from environment variables (create a .env file)
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const SCOPES = "https://www.googleapis.com/auth/drive.file";

export const initGoogleDrive = () => {
  return new Promise<void>((resolve, reject) => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        scope: SCOPES,
      }).then(() => resolve()).catch((err: any) => reject(err));
    });
  });
};

export const signIn = async () => {
  const authInstance = gapi.auth2.getAuthInstance();
  if (!authInstance.isSignedIn.get()) {
    await authInstance.signIn();
  }
  return authInstance.currentUser.get().getAuthResponse().access_token;
};

export const convertPPTXtoPDF = async (file: File) => {
  try {
    const accessToken = await signIn();

    // 1. Upload .pptx and let Drive convert it to a Google Presentation
    const metadata = {
      name: file.name,
      mimeType: 'application/vnd.google-apps.presentation'
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    const uploadResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData
    });

    const uploadResult = await uploadResponse.json();
    const fileId = uploadResult.id;
    if (!fileId) throw new Error("Upload failed");

    // 2. Export the uploaded presentation as PDF
    const exportResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/pdf`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!exportResponse.ok) throw new Error("Conversion failed");
    const pdfBlob = await exportResponse.blob();

    // 3. Clean up – delete the temporary file from Drive
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    return pdfBlob;
  } catch (error) {
    console.error("Drive API Error:", error);
    throw error;
  }
};

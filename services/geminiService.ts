import { GoogleGenAI } from "@google/genai";

// ---------------------------------------------------------
// 1. Helper: API Keys Management
// ---------------------------------------------------------
const getApiKeys = (): string[] => {
  // Vercel environment variable se key uthayenge
  const keysString = process.env.API_KEY || "";

  // Comma se split karke array banayenge aur extra spaces hatayenge
  const keys = keysString.split(',').map(k => k.trim()).filter(k => k);

  if (keys.length === 0) {
    console.error("No API Keys found in environment variables (API_KEY).");
  }
  return keys;
};

// ---------------------------------------------------------
// 2. Helper: Retry Logic (Rotation Strategy)
// ---------------------------------------------------------
const generateContentWithRetry = async (modelName: string, params: any) => {
  const apiKeys = getApiKeys();
  let lastError = null;

  // Har ek key ke liye loop chalayenge
  for (const apiKey of apiKeys) {
    try {
      // Current key ke saath naya client banayein
      const ai = new GoogleGenAI({ apiKey });

      // Request bhejein
      const response = await ai.models.generateContent({
        model: modelName,
        ...params
      });

      // Agar success ho gaya, toh response return karein aur loop tod dein
      return response;

    } catch (error: any) {
      // Sirf last ke 4 chars dikhayenge security ke liye
      const keySuffix = apiKey.slice(-4);
      console.warn(`Key ending in ...${keySuffix} failed. Switching to next key... Error:`, error.message);

      lastError = error;
      // Continue to next key in the loop
      continue;
    }
  }

  // Agar saari keys try karne ke baad bhi fail ho gaya
  throw lastError || new Error("All API keys exhausted or failed.");
};

// ---------------------------------------------------------
// 3. Exported Function: Document Analysis
// ---------------------------------------------------------
export const analyzeDocumentImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    // Hum 'gemini-2.5-flash' use kar rahe hain jo fast aur stable hai
    const response = await generateContentWithRetry('gemini-2.5-flash', {
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: "Analyze this document image. Tell me what type of document it is (e.g., Invoice, Contract, Report), extract the main title if visible, and give a 1-sentence summary of its likely purpose. This will help the user decide how to sort it in a PDF merger app."
          }
        ]
      }
    });

    return response?.text || "Could not analyze the image.";
  } catch (error) {
    console.error("Error analyzing image after all retries:", error);
    return "Failed to analyze the document. Please try again later.";
  }
};

// ---------------------------------------------------------
// 4. Exported Function: AI Chat Assistance
// ---------------------------------------------------------
export const getAiAssistance = async (
  prompt: string,
  history: { role: string; text: string }[]
): Promise<string> => {

  const modelName = 'gemini-2.5-flash';

  // 👇 यहाँ AI के लिए सख्त Rules (System Prompt) बनाये गए हैं
  const systemPrompt = `You are the highly advanced AI Assistant for 'GenzPDF', an online PDF utility website. Act with a highly professional, efficient, and sophisticated persona, similar to Tony Stark's JARVIS.

CRITICAL RULES:
1. IDENTITY: Your name is the GenzPDF AI. Never refer to yourself as PDF Fusion.
2. PLATFORM EXCLUSIVITY: When asked how to do something (e.g., merge, split, compress, convert, resize, or protect), ONLY explain how to do it using GenzPDF's tools. NEVER mention, recommend, or provide examples of competitors like Adobe Acrobat, iLovePDF, Smallpdf, or PDF24. 
3. FEATURES KNOWLEDGE: You know everything about GenzPDF. The platform has: Merge PDF, Split PDF, Compress PDF, Convert PDF (to Word, JPG, PNG, TXT), Resize Image (JPG/PNG/WebP), and Protect PDF (AES-256 encryption). Tell users that all processing is 100% Client-Side, Secure, Free, and requires NO uploads.
4. FORMATTING & TONE: Be direct, concise, and professional. Use appropriate emojis natively ⚡. Use Markdown formatting like **bold** for emphasis where needed, but absolutely NEVER output random asterisks or malformed markdown like "***jjjjj**".
5. RELEVANCE: Answer exactly what the user asked, nothing more. Do not provide unprompted extra information or wander off-topic.`;

  try {
    const contents = [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: prompt }] }
    ];

    const response = await generateContentWithRetry(modelName, {
      contents: contents,
      config: {
        systemInstruction: systemPrompt, // 👈 इसे यहाँ पास करें
      }
    });

    let text = response?.text || "";

    const chunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      const links = chunks
        .map((c: any) => c.web?.uri)
        .filter((uri: string) => uri)
        .map((uri: string) => `\nSource: ${uri}`)
        .join('');
      if (links) text += `\n\n${links}`;
    }

    return text || "I couldn't generate a response.";

  } catch (error) {
    console.error("Error getting AI assistance after all retries:", error);
    return "System overloaded. Please try again in a moment. ⚡";
  }
};

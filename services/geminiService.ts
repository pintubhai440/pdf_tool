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
    // Hum 'gemini-2.0-flash' use kar rahe hain jo fast aur stable hai
    const response = await generateContentWithRetry('gemini-2.0-flash', {
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
  
  // Logic: Complex prompts ke liye bhi abhi hum Flash use kar rahe hain reliability ke liye.
  // Agar future me Pro model chahiye ho, toh ternary operator uncomment kar sakte hain.
  const isComplex = /plan|strategy|organize|structure|complex|reason/i.test(prompt);
  const modelName = 'Gemini 2.5 Flash-Lite'; // Filhal dono ke liye Flash rakha hai fast response ke liye

  try {
    // History aur current prompt ko format karein
    const contents = [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: prompt }] }
    ];

    const response = await generateContentWithRetry(modelName, {
        contents: contents,
        // Search tool hata diya gaya hai taaki rotation simple rahe,
        // par agar chahiye toh config: { tools: [{ googleSearch: {} }] } add kar sakte hain.
        config: {} 
    });
    
    let text = response?.text || "";
    
    // Agar grounding metadata (sources) available hai toh unhe append karein
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
    return "Sorry, all my AI keys are currently busy or exhausted. Please try again in a moment.";
  }
};

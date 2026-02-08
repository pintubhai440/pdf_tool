import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const analyzeDocumentImage = async (base64Image: string, mimeType: string): Promise<string> => {
  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
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
      },
      config: {
        // Use thinking budget for deeper analysis of complex document layouts if needed, 
        // though for single page summary standard inference is often enough. 
        // We will use a small budget to ensure accuracy on text extraction.
        thinkingConfig: { thinkingBudget: 2048 } 
      }
    });

    return response.text || "Could not analyze the image.";
  } catch (error) {
    console.error("Error analyzing image:", error);
    return "Failed to analyze the document. Please try again.";
  }
};

export const getAiAssistance = async (
  prompt: string, 
  history: { role: string; text: string }[]
): Promise<string> => {
  const ai = getAiClient();
  
  // Decide model based on complexity (heuristic)
  // For this app, we will use gemini-3-flash-preview with Search for general queries
  // and gemini-3-pro-preview if the user asks for complex reasoning.
  
  // Simple heuristic: if prompt contains "plan", "strategy", "organize", "complex", use Pro with Thinking.
  const isComplex = /plan|strategy|organize|structure|complex|reason/i.test(prompt);

  try {
    if (isComplex) {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: [
                ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
                { role: 'user', parts: [{ text: prompt }] }
            ],
            config: {
                thinkingConfig: { thinkingBudget: 32768 }
            }
        });
        return response.text || "I couldn't generate a response.";
    } else {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
                 ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
                { role: 'user', parts: [{ text: prompt }] }
            ],
            config: {
                tools: [{ googleSearch: {} }], // Enable grounding for latest info
            }
        });
        
        let text = response.text || "";
        
        // Append grounding info if available
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
            const links = chunks
                .map((c: any) => c.web?.uri)
                .filter((uri: string) => uri)
                .map((uri: string) => `\nSource: ${uri}`)
                .join('');
            if (links) text += `\n\n${links}`;
        }
        
        return text || "I couldn't generate a response.";
    }

  } catch (error) {
    console.error("Error getting AI assistance:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};
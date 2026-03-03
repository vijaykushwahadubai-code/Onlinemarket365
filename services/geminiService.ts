
import { GoogleGenAI, GenerateContentResponse, Part, ThinkingLevel } from "@google/genai";

// Helper to safely get API key
const getApiKey = () => {
  try {
    // 1. Check Vite Environment Variables
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
    // 2. Check Standard Process Environment
    // @ts-ignore
    if (typeof process !== 'undefined' && process && process.env && process.env.API_KEY) {
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Environment variable access error:", e);
  }
  // 3. Fallback to provided key for immediate deployment
  return 'AIzaSyDctvtsI1RXWE1hEETzSvjncO3Q8Idbe4U';
};

const getClient = () => {
  const key = getApiKey();
  if (!key) {
    console.warn("API Key is missing. AI features will not function.");
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey: key });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI client:", e);
    return null;
  }
};

/**
 * Cleans markdown code blocks from JSON strings to prevent parsing crashes.
 */
const cleanJsonString = (text: string): string => {
  if (!text) return "{}";
  // Remove ```json and ``` wrapping
  let cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "");
  return cleaned.trim();
};

export const generateText = async (prompt: string, systemInstruction?: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "System: API Key is missing. Please configure your environment variables.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });
    
    return response.text || "No response generated.";
  } catch (error: any) {
    console.error("Gemini Text Generation Error:", error);
    return `AI Error: ${error.message || "Service unavailable"}. Please try again later.`;
  }
};

export const generateReasoning = async (prompt: string, level: ThinkingLevel = ThinkingLevel.HIGH): Promise<string> => {
  const ai = getClient();
  if (!ai) return "System: API Key is missing. Cannot perform reasoning.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: level },
      },
    });
    
    return response.text || "No reasoning output generated.";
  } catch (error: any) {
    console.error("Gemini Reasoning Error:", error);
    return `Reasoning Error: ${error.message || "Model failed"}.`;
  }
};

export const generateGroundedContent = async (prompt: string, type: 'search' | 'maps'): Promise<{ text: string, sources: any[] }> => {
  const ai = getClient();
  if (!ai) return { text: "System: API Key is missing.", sources: [] };

  try {
    let model = 'gemini-3-flash-preview';
    let tools: any[] = [];
    
    if (type === 'search') {
      tools = [{ googleSearch: {} }];
    } else if (type === 'maps') {
      model = 'gemini-2.5-flash';
      tools = [{ googleMaps: {} }];
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { tools: tools },
    });

    const text = response.text || "No results found.";
    // Safe access to grounding metadata
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, sources };
  } catch (error: any) {
    console.error("Grounding Error:", error);
    return { text: "Could not fetch grounded data.", sources: [] };
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  const ai = getClient();
  if (!ai) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Correct model for image generation
      contents: prompt
    });

    // Extract image from response parts
    // Note: The structure depends on the specific model output, handling standard inlineData
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
       for (const part of parts) {
          if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image')) {
             return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
       }
    }
    
    throw new Error("No image data returned from model.");
  } catch (error: any) {
    console.error("Image Gen Error:", error);
    // Fallback to a placeholder if generation fails to prevent UI crash
    throw new Error(`Image generation failed: ${error.message}`);
  }
};

export const generateVideo = async (prompt: string, aspectRatio: '16:9' | '9:16'): Promise<string> => {
  const ai = getClient();
  if (!ai) throw new Error("API Key missing");

  try {
    // Note: Veo 3.1 is the correct model for video
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    // Since this is an async operation, we need to wait/poll in a real app.
    // For this demo structure, we'll return the initial URI or handle polling if the SDK supports 'wait'.
    // Assuming operation returns a promise or we need to poll manually.
    // Simplifying for this demo:
    
    // Simulate wait logic (simplified)
    let op = operation;
    let retries = 0;
    while (!op.done && retries < 20) {
       await new Promise(r => setTimeout(r, 2000));
       op = await ai.operations.getVideosOperation({ operation: op });
       retries++;
    }

    if (op.done && op.response?.generatedVideos?.[0]?.video?.uri) {
       const videoUri = op.response.generatedVideos[0].video.uri;
       // We must append the key to fetch the actual bytes if it's a direct link
       return `${videoUri}&key=${getApiKey()}`;
    }

    throw new Error("Video generation timed out or failed.");

  } catch (error: any) {
    console.error("Video Gen Error:", error);
    throw new Error(`Video generation failed: ${error.message}`);
  }
};

export const generateSpeech = async (text: string, voiceName: string): Promise<string> => {
  const ai = getClient();
  if (!ai) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          }
        }
      }
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (audioData) {
      return audioData;
    }
    throw new Error("No audio data returned.");
  } catch (error: any) {
    console.error("TTS Error:", error);
    throw new Error("Speech generation failed.");
  }
};

export const analyzeAudio = async (base64Audio: string, mimeType: string): Promise<{gender: string, tone: string}> => {
  const ai = getClient();
  if (!ai) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Audio } },
          { text: "Analyze the speaker in this audio. Return JSON with 'gender' (Male/Female) and 'tone' (e.g. Deep, Energetic, Soft)." }
        ]
      },
      config: { responseMimeType: 'application/json' }
    });

    const json = cleanJsonString(response.text || "{}");
    return JSON.parse(json);
  } catch (error) {
    console.error("Audio Analysis Error:", error);
    return { gender: 'Unknown', tone: 'Neutral' };
  }
};

export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getClient();
  if (!ai) throw new Error("API Key missing");

  try {
    // For image editing, we pass image + text
    // Note: Image editing support varies by model. Using 2.5 flash image or 3 pro image.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Image.split(',')[1] } },
          { text: prompt }
        ]
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
       for (const part of parts) {
          if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image')) {
             return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
       }
    }
    throw new Error("No edited image returned.");
  } catch (error: any) {
    console.error("Image Edit Error:", error);
    throw new Error("Image editing failed.");
  }
};

export const analyzeImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API Key missing.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } },
          { text: prompt }
        ]
      }
    });
    return response.text || "No analysis generated.";
  } catch (error: any) {
    console.error("Vision Error:", error);
    return "Failed to analyze image.";
  }
};

export const createChatSession = () => {
  const ai = getClient();
  if (!ai) return null;
  
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are a helpful AI assistant in the Market365 Pro suite.",
    }
  });
};

import { GoogleGenAI } from '@google/genai';

/**
 * Lazy singleton GoogleGenAI client.
 * Guards against crashing if the API key is not configured at startup.
 */
let aiClient: GoogleGenAI | null = null;

export function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

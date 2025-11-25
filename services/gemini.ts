
import { GoogleGenAI } from "@google/genai";
import { ThemeConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export async function getMentorMessage(
  context: 'welcome' | 'correct' | 'mistake' | 'level_complete',
  userName: string,
  theme: ThemeConfig,
  details?: { question?: string; answer?: number; correctAnswer?: number; streak?: number }
): Promise<string> {
  
  let prompt = "";
  
  const systemInstruction = `
    Stai impersonando "${theme.mentorName}", un mentore per un'app educativa di matematica per bambini.
    Il tema dell'app è: ${theme.name}.
    Il tuo tono deve essere coerente con il personaggio (es. magico per mago, eroico per supereroe, giocoso per Mario).
    Parla in italiano. Usa emoji attinenti (${theme.mentorEmoji}). Sii breve (max 1-2 frasi).
    Il bambino si chiama ${userName}.
  `;

  switch (context) {
    case 'welcome':
      prompt = `Saluta ${userName} nel tuo stile unico e invitalo a imparare le tabelline.`;
      break;
    case 'correct':
      prompt = `Il bambino ha risposto correttamente a ${details?.question}. Dagli un complimento in stile ${theme.mentorName}!`;
      break;
    case 'mistake':
      prompt = `Il bambino ha sbagliato ${details?.question}. Ha risposto ${details?.answer}, ma era ${details?.correctAnswer}. 
      Incoraggialo gentilmente in stile ${theme.mentorName} a riprovare.`;
      break;
    case 'level_complete':
      prompt = `Il bambino ha finito una sessione! Congratulati per il traguardo raggiunto.`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });
    return response.text || "Benfatto!";
  } catch (error) {
    console.error("Gemini Error", error);
    // Fallback static messages if offline/error
    return `Bravo ${userName}! Continua così! ${theme.mentorEmoji}`;
  }
}

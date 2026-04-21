import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getCropRecommendation(inputs: {
  n: number;
  p: number;
  k: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  location: string;
}) {
  const prompt = `As an agricultural expert, recommend the best crop based on these parameters:
  Nitrogen (N): ${inputs.n}, Phosphorus (P): ${inputs.p}, Potassium (K): ${inputs.k},
  Temperature: ${inputs.temperature}°C, Humidity: ${inputs.humidity}%, pH: ${inputs.ph},
  Rainfall: ${inputs.rainfall}mm.
  Location Context: ${inputs.location}
  
  Provide exactly one recommended crop name and 4 detailed farming tips.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedCrop: { type: Type.STRING },
          tips: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["recommendedCrop", "tips"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function getMarketPrices(location: string) {
  const prompt = `Search for the most recent Mandi prices (market prices) for agricultural commodities in ${location}, India. 
  Focus on identifying prices from the last 24-48 hours if possible.
  Return a structured list of major crops and their current trading prices.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      toolConfig: { includeServerSideToolInvocations: true },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          location: { type: Type.STRING },
          lastUpdated: { type: Type.STRING },
          prices: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                commodity: { type: Type.STRING },
                price: { type: Type.STRING },
                market: { type: Type.STRING },
              },
              required: ["commodity", "price", "market"]
            }
          }
        },
        required: ["location", "lastUpdated", "prices"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function detectPest(base64Image: string) {
  const prompt = "Identify the pest in this agricultural image. Provide the pest name, a confidence score (0-1), a list of recommended pesticides, and basic details about the pest.";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: prompt },
        { 
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.split(',')[1] || base64Image // Handle potential data:image/jpeg;base64, prefix
          }
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pestName: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          pesticides: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          details: { type: Type.STRING }
        },
        required: ["pestName", "confidence", "pesticides", "details"]
      }
    }
  });

  return JSON.parse(response.text);
}

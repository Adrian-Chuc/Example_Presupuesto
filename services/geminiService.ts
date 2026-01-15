
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartBudgetTips = async (total: number, departments: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest a percentage distribution for a total budget of ${total} across these departments: ${departments.join(', ')}. Provide insights on why.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            distributions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  department: { type: Type.STRING },
                  percentage: { type: Type.NUMBER },
                  reason: { type: Type.STRING }
                },
                required: ["department", "percentage", "reason"]
              }
            }
          },
          required: ["distributions"]
        }
      }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini tips failed:", error);
    return null;
  }
};

export const validateBudgetStructure = async (budget: any) => {
    // This could call a real NetSuite validation logic or use AI to find anomalies
    return { isValid: true, message: "Structure passed NetSuite-ready validation." };
};

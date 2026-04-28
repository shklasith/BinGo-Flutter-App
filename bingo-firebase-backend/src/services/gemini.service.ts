import { GoogleGenAI } from '@google/genai';

import { ClassificationResult, WasteCategory } from '../types/domain';

const model = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';

const validCategories: WasteCategory[] = ['Recyclable', 'Compost', 'E-Waste', 'Landfill', 'Special', 'Unknown'];

const classificationSchema = {
  type: 'object',
  properties: {
    itemName: { type: 'string' },
    isWaste: { type: 'boolean' },
    category: {
      type: 'string',
      enum: validCategories,
    },
    prepSteps: {
      type: 'array',
      items: { type: 'string' },
    },
    confidence: { type: 'number' },
  },
  required: ['itemName', 'isWaste', 'category', 'prepSteps', 'confidence'],
};

export const analyzeWasteImage = async (buffer: Buffer, mimeType: string): Promise<ClassificationResult> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `Analyze this image of an item to determine if it is waste and how to dispose of it.
Return strictly valid JSON with itemName, isWaste, category, prepSteps, and confidence.
Category must be one of Recyclable, Compost, E-Waste, Landfill, Special, Unknown.
If isWaste is false, still provide the most likely disposal category if it were discarded.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { data: buffer.toString('base64'), mimeType } },
        ],
      },
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: classificationSchema as any,
    },
  });

  const rawText = (response.text || '{}').replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(rawText) as Partial<ClassificationResult>;
  const category = validCategories.includes(parsed.category as WasteCategory) ? (parsed.category as WasteCategory) : 'Unknown';

  return {
    itemName: parsed.itemName || 'Unknown item',
    isWaste: parsed.isWaste ?? true,
    category,
    prepSteps: Array.isArray(parsed.prepSteps) ? parsed.prepSteps : [],
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
  };
};

import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = 'gemini-2.0-flash';

export interface ClassificationResult {
    itemName: string;
    isWaste: boolean;
    category: 'Recyclable' | 'Compost' | 'E-Waste' | 'Landfill' | 'Special' | 'Unknown';
    prepSteps: string[];
    confidence: number;
}

const CLASSIFICATION_SCHEMA = {
    type: 'object',
    properties: {
        category: {
            type: 'string',
            enum: ['Recyclable', 'Compost', 'E-Waste', 'Landfill', 'Special', 'Unknown']
        },
        prepSteps: {
            type: 'array',
            items: { type: 'string' }
        },
        confidence: { type: 'number' }
    },
    required: ['category', 'prepSteps', 'confidence']
};

export const analyzeWasteImage = async (filePath: string, mimeType: string): Promise<ClassificationResult> => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        const imageBuffer = await fs.readFile(filePath);
        const prompt = `Analyze this image of an item to determine if it is waste and how to dispose of it.
Return the result in strictly valid JSON format with the following keys:
{
  "itemName": "Short descriptive name of the item (e.g., 'Plastic Water Bottle', 'Apple Core')",
  "isWaste": true | false,
  "category": "Recyclable | Compost | E-Waste | Landfill | Special | Unknown",
  "prepSteps": ["step1", "step2"],
  "confidence": 0.0 to 1.0
}
If isWaste is false, still provide the most likely category for disposal if it were to be discarded.`;

        const response = await ai.models.generateContent({
            model,
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: prompt },
                        { inlineData: { data: imageBuffer.toString('base64'), mimeType } }
                    ]
                }
            ],
            config: {
                responseMimeType: 'application/json',
                responseSchema: CLASSIFICATION_SCHEMA as any
            }
        });

        let responseText = response.text || '{}';

        if (responseText.includes('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (responseText.includes('```')) {
            responseText = responseText.replace(/```/g, '').trim();
        }

        const result: ClassificationResult = JSON.parse(responseText);
        const validCategories = ['Recyclable', 'Compost', 'E-Waste', 'Landfill', 'Special', 'Unknown'];

        if (!validCategories.includes(result.category)) {
            result.category = 'Unknown';
        }

        return result;
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        throw new Error(`Failed to analyze image: ${error.message}`);
    }
};

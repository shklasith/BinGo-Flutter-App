import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-2.0-flash"; // Optimized for structured multimodal output

export interface ClassificationResult {
    category: 'Recyclable' | 'Compost' | 'E-Waste' | 'Landfill' | 'Special' | 'Unknown';
    prepSteps: string[];
    confidence: number;
}

const CLASSIFICATION_SCHEMA = {
    type: "object",
    properties: {
        category: {
            type: "string",
            enum: ['Recyclable', 'Compost', 'E-Waste', 'Landfill', 'Special', 'Unknown']
        },
        prepSteps: {
            type: "array",
            items: { type: "string" }
        },
        confidence: { type: "number" }
    },
    required: ["category", "prepSteps", "confidence"]
};

export const analyzeWasteImage = async (filePath: string, mimeType: string): Promise<ClassificationResult> => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        const imageBuffer = await fs.readFile(filePath);

        const prompt = `Analyze this image of a waste item. 
Classify it into one of the specified categories and provide short physical preparation steps for disposal.`;

        const response = await ai.models.generateContent({
            model: model,
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        { inlineData: { data: imageBuffer.toString("base64"), mimeType } }
                    ]
                }
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: CLASSIFICATION_SCHEMA as any
            }
        });

        const result: ClassificationResult = JSON.parse(response.text || "{}");
        return result;

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        throw new Error(`Failed to analyze image: ${error.message}`);
    }
};

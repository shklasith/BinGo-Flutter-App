import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-3-flash-preview"; // Latest model requested by user

export interface ClassificationResult {
    itemName: string;
    isWaste: boolean;
    category: 'Recyclable' | 'Compost' | 'E-Waste' | 'Landfill' | 'Special' | 'Unknown';
    prepSteps: string[];
    confidence: number;
}

export const analyzeWasteImage = async (filePath: string, mimeType: string): Promise<ClassificationResult> => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        // We use generating content directly with the image data (in Node.js we can pass Buffer)
        const imageBuffer = fs.readFileSync(filePath);

        const prompt = `Analyze this image of an item to determine if it is waste and how to dispose of it.
Return the result in strictly valid JSON format with the following keys:
{
  "itemName": "Short descriptive name of the item (e.g., 'Plastic Water Bottle', 'Apple Core')",
  "isWaste": true | false (whether the item is typically considered waste/disposable),
  "category": "Recyclable | Compost | E-Waste | Landfill | Special | Unknown",
  "prepSteps": ["step1", "step2"], (1-3 short physical preparation steps for disposal, e.g., 'Rinse container', 'Remove cap')
  "confidence": 0.0 to 1.0 (float)
}
If isWaste is false, still provide the most likely category for disposal if it WERE to be discarded.`;

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
            ]
        });

        let responseText = response.text || "{}";

        // Strip markdown code block markers if present
        if (responseText.includes("\`\`\`json")) {
            responseText = responseText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
        } else if (responseText.includes("\`\`\`")) {
            responseText = responseText.replace(/\`\`\`/g, "").trim();
        }

        const result: ClassificationResult = JSON.parse(responseText);

        // Basic validation
        const validCategories = ['Recyclable', 'Compost', 'E-Waste', 'Landfill', 'Special', 'Unknown'];
        if (!validCategories || !validCategories.includes(result.category)) {
            result.category = 'Unknown';
        }

        return result;

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to analyze image using AI");
    }
};

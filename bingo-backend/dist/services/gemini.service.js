"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeWasteImage = void 0;
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
const promises_1 = __importDefault(require("fs/promises"));
dotenv_1.default.config();
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = 'gemini-2.0-flash';
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
const analyzeWasteImage = async (filePath, mimeType) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }
        const imageBuffer = await promises_1.default.readFile(filePath);
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
                responseSchema: CLASSIFICATION_SCHEMA
            }
        });
        let responseText = response.text || '{}';
        if (responseText.includes('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        }
        else if (responseText.includes('```')) {
            responseText = responseText.replace(/```/g, '').trim();
        }
        const result = JSON.parse(responseText);
        const validCategories = ['Recyclable', 'Compost', 'E-Waste', 'Landfill', 'Special', 'Unknown'];
        if (!validCategories.includes(result.category)) {
            result.category = 'Unknown';
        }
        return result;
    }
    catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error(`Failed to analyze image: ${error.message}`);
    }
};
exports.analyzeWasteImage = analyzeWasteImage;

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
const model = "gemini-2.0-flash"; // Optimized for structured multimodal output
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
const analyzeWasteImage = async (filePath, mimeType) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }
        const imageBuffer = await promises_1.default.readFile(filePath);
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
                responseSchema: CLASSIFICATION_SCHEMA
            }
        });
        const result = JSON.parse(response.text || "{}");
        return result;
    }
    catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error(`Failed to analyze image: ${error.message}`);
    }
};
exports.analyzeWasteImage = analyzeWasteImage;

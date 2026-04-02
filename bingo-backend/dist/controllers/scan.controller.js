"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanWaste = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const ScanHistory_1 = __importDefault(require("../models/ScanHistory"));
const gemini_service_1 = require("../services/gemini.service");
const scanWaste = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image provided' });
        }
        const filePath = req.file.path;
        const mimeType = req.file.mimetype;
        const classification = await (0, gemini_service_1.analyzeWasteImage)(filePath, mimeType);
        try {
            await promises_1.default.unlink(filePath);
        }
        catch (error) {
            console.warn('Failed to delete temp file:', error);
        }
        let pointsToAward = 0;
        const category = classification.category;
        if (category === 'Recyclable' || category === 'Compost' || category === 'E-Waste') {
            pointsToAward = 10;
        }
        else if (category === 'Special') {
            pointsToAward = 15;
        }
        else if (category === 'Landfill') {
            pointsToAward = 2;
        }
        const scan = await ScanHistory_1.default.create({
            userId: user._id,
            imageUrl: `local/${req.file.filename}`,
            classificationResult: classification,
            pointsEarned: pointsToAward
        });
        user.points += pointsToAward;
        if (category === 'Recyclable') {
            user.impactStats.plasticDiverted += 1;
            user.impactStats.co2Reduced += 0.5;
        }
        else if (category === 'Compost') {
            user.impactStats.co2Reduced += 0.2;
        }
        else if (category === 'E-Waste') {
            user.impactStats.co2Reduced += 1.0;
        }
        await user.save();
        return res.status(200).json({
            success: true,
            data: {
                classification,
                pointsEarned: pointsToAward,
                scanId: scan._id,
                newTotalPoints: user.points
            }
        });
    }
    catch (error) {
        console.error('Scan Controller Error:', error);
        return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
};
exports.scanWaste = scanWaste;

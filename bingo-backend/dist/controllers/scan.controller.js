"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanWaste = void 0;
const gemini_service_1 = require("../services/gemini.service");
const ScanHistory_1 = __importDefault(require("../models/ScanHistory"));
const User_1 = __importDefault(require("../models/User"));
const fs_1 = __importDefault(require("fs"));
const scanWaste = async (req, res) => {
    try {
        // Assume user is attached to req by auth middleware
        // For testing, just take any userId from body or create dummy
        let userId = req.body.userId || req.query.userId;
        // If no userId, use a dummy one for the prototype
        if (!userId) {
            userId = '65f1a2b3c4d5e6f7a8b9c0d1';
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image provided' });
        }
        const filePath = req.file.path;
        const mimeType = req.file.mimetype;
        // 1. Send image to Gemini API
        const classification = await (0, gemini_service_1.analyzeWasteImage)(filePath, mimeType);
        // 2. Clean up local uploaded file (in production would use cloud storage)
        try {
            fs_1.default.unlinkSync(filePath);
        }
        catch (e) {
            console.warn("Failed to delete temp file:", e);
        }
        // 3. Award points based on classification
        let pointsToAward = 0;
        if (classification.category !== 'Unknown' && classification.category !== 'Landfill') {
            pointsToAward = 10;
        }
        else if (classification.category === 'Landfill') {
            pointsToAward = 2; // small points for trying to organize
        }
        // 4. Save scan to history
        const scan = new ScanHistory_1.default({
            userId,
            imageUrl: 'local/' + req.file.filename, // placeholder url
            classificationResult: classification,
            pointsEarned: pointsToAward
        });
        await scan.save();
        // 5. Update User points and stats
        const user = await User_1.default.findById(userId);
        if (user) {
            user.points += pointsToAward;
            if (classification.category === 'Recyclable') {
                user.impactStats.plasticDiverted += 1;
                user.impactStats.co2Reduced += 0.5;
            }
            if (classification.category === 'Compost') {
                user.impactStats.co2Reduced += 0.2;
            }
            await user.save();
        }
        // Return result
        res.status(200).json({
            success: true,
            data: {
                classification,
                pointsEarned: pointsToAward,
                scanId: scan._id
            }
        });
    }
    catch (error) {
        console.error("Scan Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.scanWaste = scanWaste;

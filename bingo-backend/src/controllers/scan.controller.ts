import { Request, Response } from 'express';
import { analyzeWasteImage } from '../services/gemini.service';
import ScanHistory from '../models/ScanHistory';
import User from '../models/User';
import fs from 'fs';
import path from 'path';

export const scanWaste = async (req: Request, res: Response) => {
    try {
        // Assume user is attached to req by auth middleware
        // For testing, just take any userId from body or create dummy
        const userId = req.body.userId || req.query.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image provided' });
        }

        const filePath = req.file.path;
        const mimeType = req.file.mimetype;

        // 1. Send image to Gemini API
        const classification = await analyzeWasteImage(filePath, mimeType);

        // 2. Clean up local uploaded file (in production would use cloud storage)
        try {
            fs.unlinkSync(filePath);
        } catch (e) {
            console.warn("Failed to delete temp file:", e);
        }

        // 3. Award points based on classification
        let pointsToAward = 0;
        if (classification.category !== 'Unknown' && classification.category !== 'Landfill') {
            pointsToAward = 10;
        } else if (classification.category === 'Landfill') {
            pointsToAward = 2; // small points for trying to organize
        }

        // 4. Save scan to history
        const scan = new ScanHistory({
            userId,
            imageUrl: 'local/' + req.file.filename, // placeholder url
            classificationResult: classification,
            pointsEarned: pointsToAward
        });
        await scan.save();

        // 5. Update User points and stats
        const user = await User.findById(userId);
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

    } catch (error: any) {
        console.error("Scan Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

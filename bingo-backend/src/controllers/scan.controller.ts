import { Response } from 'express';
import fs from 'fs/promises';

import { AuthRequest } from '../middleware/auth';
import ScanHistory from '../models/ScanHistory';
import { analyzeWasteImage } from '../services/gemini.service';

export const scanWaste = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image provided' });
        }

        const user = req.user;
        const filePath = req.file.path;
        const mimeType = req.file.mimetype;
        const filename = req.file.filename;
        const classification = await analyzeWasteImage(filePath, mimeType);

        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.warn('Failed to delete temp file:', error);
        }

        let pointsToAward = 0;
        const category = classification.category;

        if (category === 'Recyclable' || category === 'Compost' || category === 'E-Waste') {
            pointsToAward = 10;
        } else if (category === 'Special') {
            pointsToAward = 15;
        } else if (category === 'Landfill') {
            pointsToAward = 2;
        }

        let scanId = null;
        let newTotalPoints = null;

        if (user) {
            const scan = await ScanHistory.create({
                userId: user._id,
                imageUrl: `local/${filename}`,
                classificationResult: classification,
                pointsEarned: pointsToAward
            });

            user.points += pointsToAward;

            if (category === 'Recyclable') {
                user.impactStats.plasticDiverted += 1;
                user.impactStats.co2Reduced += 0.5;
            } else if (category === 'Compost') {
                user.impactStats.co2Reduced += 0.2;
            } else if (category === 'E-Waste') {
                user.impactStats.co2Reduced += 1.0;
            }

            await user.save();
            scanId = scan._id;
            newTotalPoints = user.points;
        } else {
            pointsToAward = 0;
        }

        return res.status(200).json({
            success: true,
            data: {
                classification,
                pointsEarned: pointsToAward,
                scanId,
                newTotalPoints
            }
        });
    } catch (error: any) {
        console.error('Scan Controller Error:', error);
        return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
};

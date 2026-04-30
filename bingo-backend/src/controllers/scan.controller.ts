import { Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

import { AuthRequest } from '../middleware/auth';
import ScanHistory from '../models/ScanHistory';
import { analyzeWasteImage } from '../services/gemini.service';

export const scanWaste = async (req: AuthRequest, res: Response) => {
    let filePath = '';
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image provided' });
        }

        const user = req.user;
        filePath = req.file.path;
        let mimeType = req.file.mimetype;
        const filename = req.file.filename;

        // Correct MIME type if it's application/octet-stream
        if (mimeType === 'application/octet-stream') {
            const ext = path.extname(filename).toLowerCase();
            if (ext === '.jpg' || ext === '.jpeg') {
                mimeType = 'image/jpeg';
            } else if (ext === '.png') {
                mimeType = 'image/png';
            } else if (ext === '.webp') {
                mimeType = 'image/webp';
            } else if (ext === '.heic' || ext === '.heif') {
                mimeType = 'image/heic';
            } else {
                // Default to image/jpeg for most photos if unknown
                mimeType = 'image/jpeg';
            }
        }

        const classification = await analyzeWasteImage(filePath, mimeType);

        try {
            await fs.unlink(filePath);
            filePath = '';
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
        if (filePath) {
            try {
                await fs.unlink(filePath);
            } catch (unlinkError) {
                console.warn('Failed to delete temp file after error:', unlinkError);
            }
        }
        console.error('Scan Controller Error:', error);
        return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
};

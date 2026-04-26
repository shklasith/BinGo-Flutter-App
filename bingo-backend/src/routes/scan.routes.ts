import { Router } from 'express';
import { scanWaste } from '../controllers/scan.controller';
import { optionalProtect } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const router = Router();

// Setup multer for local file uploads (temp directory)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../uploads');
        // create dir if it doesn't exist
        const fs = require('fs');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

/**
 * @openapi
 * /scan:
 *   post:
 *     tags:
 *       - Scan
 *     summary: Scan a waste image
 *     description: >
 *       Uploads an image of waste, classifies it using the Gemini AI service,
 *       awards points for signed-in users, and returns classification-only results for guests.
 *       **Categories & Points:** Recyclable/Compost/E-Waste → 10 pts, Special → 15 pts, Landfill → 2 pts.
 *     security:
 *       - bearerAuth: []
 *       - {}
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The waste image file to classify
 *     responses:
 *       200:
 *         description: Image classified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     classification:
 *                       $ref: '#/components/schemas/ClassificationResult'
 *                     pointsEarned:
 *                       type: number
 *                       example: 10
 *                     scanId:
 *                       type: string
 *                       example: 664b2a...
 *                     newTotalPoints:
 *                       type: number
 *                       example: 130
 *       400:
 *         description: No image provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', optionalProtect, upload.single('image'), scanWaste as any);

export default router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scan_controller_1 = require("../controllers/scan.controller");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
// Setup multer for local file uploads (temp directory)
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const dir = path_1.default.join(__dirname, '../../uploads');
        // create dir if it doesn't exist
        const fs = require('fs');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage });
/**
 * @openapi
 * /scan:
 *   post:
 *     tags:
 *       - Scan
 *     summary: Scan a waste image
 *     description: >
 *       Uploads an image of waste, classifies it using the Gemini AI service,
 *       awards points based on the waste category, and updates the user's impact stats.
 *       **Categories & Points:** Recyclable/Compost/E-Waste → 10 pts, Special → 15 pts, Landfill → 2 pts.
 *     security:
 *       - bearerAuth: []
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
router.post('/', auth_1.protect, upload.single('image'), scan_controller_1.scanWaste);
exports.default = router;

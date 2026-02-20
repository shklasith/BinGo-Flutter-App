import { Router } from 'express';
import { scanWaste } from '../controllers/scan.controller';
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

// POST /api/scan
router.post('/', upload.single('image'), scanWaste as any);

export default router;

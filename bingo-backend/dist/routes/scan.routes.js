"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scan_controller_1 = require("../controllers/scan.controller");
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
// POST /api/scan
router.post('/', upload.single('image'), scan_controller_1.scanWaste);
exports.default = router;

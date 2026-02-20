"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNearbyCenters = exports.seedCenters = void 0;
const Center_1 = __importDefault(require("../models/Center"));
// Testing: Seed dummy centers
const seedCenters = async (req, res) => {
    try {
        const dummyCenters = [
            {
                name: 'Colombo Recycling Hub',
                address: '123 Main St, Colombo',
                location: { type: 'Point', coordinates: [79.8612, 6.9271] },
                acceptedMaterials: ['Recyclable', 'E-Waste'],
                operatingHours: '9 AM - 5 PM',
                contactNumber: '0112345678'
            },
            {
                name: 'Green Compost Center',
                address: '45 Park Rd, Colombo',
                location: { type: 'Point', coordinates: [79.8700, 6.9300] },
                acceptedMaterials: ['Compost'],
                operatingHours: '8 AM - 4 PM',
                contactNumber: '0112345679'
            }
        ];
        await Center_1.default.deleteMany({});
        await Center_1.default.insertMany(dummyCenters);
        res.status(201).json({ success: true, message: 'Centers seeded successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.seedCenters = seedCenters;
const getNearbyCenters = async (req, res) => {
    try {
        const { lat, lng, radius = 5000 } = req.query; // radius in meters
        if (!lat || !lng) {
            return res.status(400).json({ success: false, message: 'Please provide both lat and lng query params' });
        }
        const centers = await Center_1.default.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius)
                }
            }
        });
        res.status(200).json({ success: true, count: centers.length, data: centers });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getNearbyCenters = getNearbyCenters;

import { Request, Response } from 'express';
import Center from '../models/Center';

// Testing: Seed dummy centers
export const seedCenters = async (req: Request, res: Response) => {
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

        await Center.deleteMany({});
        await Center.insertMany(dummyCenters);

        res.status(201).json({ success: true, message: 'Centers seeded successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getNearbyCenters = async (req: Request, res: Response) => {
    try {
        const { lat, lng, radius = 5000 } = req.query; // radius in meters

        if (!lat || !lng) {
            return res.status(400).json({ success: false, message: 'Please provide both lat and lng query params' });
        }

        const centers = await Center.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng as string), parseFloat(lat as string)]
                    },
                    $maxDistance: parseInt(radius as string)
                }
            }
        });

        res.status(200).json({ success: true, count: centers.length, data: centers });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

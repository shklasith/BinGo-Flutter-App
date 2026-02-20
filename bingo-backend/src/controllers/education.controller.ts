import { Request, Response } from 'express';

const tips = [
    { title: "Rinse before recycling", content: "Always rinse your plastic containers. Food residue can contaminate an entire batch of recyclables." },
    { title: "Don't wish-cycle", content: "If you aren't sure if an item is recyclable, it's often better to throw it in the trash than risk contaminating the recycling bin." },
    { title: "Batteries are E-Waste", content: "Never put batteries in standard recycling or trash. They can cause fires in the processing facilities." }
];

export const getDailyTip = async (req: Request, res: Response) => {
    try {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        res.status(200).json({ success: true, data: randomTip });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const searchDatabase = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        if (!query) {
            return res.status(400).json({ success: false, message: 'Please provide a search query' });
        }

        const lowerQuery = query.toLowerCase();
        const results = tips.filter(tip =>
            tip.title.toLowerCase().includes(lowerQuery) ||
            tip.content.toLowerCase().includes(lowerQuery)
        );

        res.status(200).json({ success: true, data: results });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

import { Request, Response } from 'express';

import { getDailyTip, searchTips } from '../repositories/education.repository';

export const getDailyTipController = async (_req: Request, res: Response) => {
  try {
    const tip = await getDailyTip();
    return res.status(200).json({ success: true, data: tip });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const searchDatabase = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide a search query' });
    }

    const results = await searchTips(query);
    return res.status(200).json({ success: true, data: results });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

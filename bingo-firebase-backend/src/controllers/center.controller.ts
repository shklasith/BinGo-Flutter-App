import { Request, Response } from 'express';

import * as centerRepository from '../repositories/center.repository';

export const seedCenters = async (_req: Request, res: Response) => {
  try {
    await centerRepository.seedCenters();
    return res.status(201).json({ success: true, message: 'Centers seeded successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getNearbyCenters = async (req: Request, res: Response) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radius = Number(req.query.radius ?? 5000);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ success: false, message: 'Please provide both lat and lng query params' });
    }

    const centers = await centerRepository.getNearbyCenters(lat, lng, Number.isFinite(radius) ? radius : 5000);
    return res.status(200).json({ success: true, count: centers.length, data: centers });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

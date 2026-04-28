import { Router } from 'express';

import { getNearbyCenters, seedCenters } from '../controllers/center.controller';

const router = Router();

router.get('/nearby', getNearbyCenters as any);
router.post('/seed', seedCenters as any);

export default router;

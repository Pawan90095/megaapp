import { Router } from 'express';
import { trackEvent, getStats } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public: Track event (no auth needed to view a profile and trigger a view event)
router.post('/', trackEvent);

// Protected: Get stats (Only owner should see stats)
router.get('/:slug', authenticateToken, getStats);

export default router;

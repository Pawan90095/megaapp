import { Router } from 'express';
import { getProfile, createProfile, updateProfile, loginUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/:slug', getProfile);
router.post('/', createProfile);
router.post('/login', loginUser);

// Protected routes
router.put('/:slug', authenticateToken, updateProfile);

export default router;

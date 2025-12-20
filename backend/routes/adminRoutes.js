
import express from 'express';
import { authMiddleware } from '../auth.js';
import { adminMiddleware } from '../middleware/adminAuth.js';
import { getSystemStats, getUsers, getUserDetails } from '../controllers/adminController.js';

const router = express.Router();

// Apply auth and admin check to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stats', getSystemStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);

export default router;

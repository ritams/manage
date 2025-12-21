import express from 'express';
import { authMiddleware } from '../auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
    getNotifications,
    markRead,
    markAllRead,
    getUnreadCount,

} from '../controllers/notificationController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// In-app notifications
router.get('/', asyncHandler(getNotifications));
router.get('/unread-count', asyncHandler(getUnreadCount));
router.put('/:id/read', asyncHandler(markRead));
router.put('/read-all', asyncHandler(markAllRead));



export default router;

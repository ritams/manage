import express from 'express';
import { googleLogin, logout, me } from '../controllers/authController.js';
import { authMiddleware } from '../auth.js';

const router = express.Router();

router.post('/google', googleLogin);
router.post('/logout', logout);
router.get('/me', authMiddleware, me);

export default router;

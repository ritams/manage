import express from 'express';
import { authMiddleware } from '../auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
    getBoards,
    createBoard,
    updateBoard,
    deleteBoard
} from '../controllers/boardController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', asyncHandler(getBoards));
router.post('/', asyncHandler(createBoard));
router.put('/:id', asyncHandler(updateBoard));
router.delete('/:id', asyncHandler(deleteBoard));

export default router;

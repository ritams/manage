import express from 'express';
import { authMiddleware } from '../auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    reorderCards,
    setDueDate
} from '../controllers/cardController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', asyncHandler(createCard));
router.put('/reorder', asyncHandler(reorderCards));
router.post('/move', asyncHandler(moveCard));
router.put('/:id', asyncHandler(updateCard));
router.put('/:id/due', asyncHandler(setDueDate));
router.delete('/:id', asyncHandler(deleteCard));

export default router;

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

// Validation
import { validate, schemas } from '../middleware/validate.js';

router.post('/', validate(schemas.createCard), asyncHandler(createCard));
router.put('/reorder', asyncHandler(reorderCards)); // Custom array validation
router.post('/move', validate(schemas.moveCard), asyncHandler(moveCard));
router.put('/:id', validate(schemas.updateCard), asyncHandler(updateCard));
router.put('/:id/due', asyncHandler(setDueDate));
router.delete('/:id', asyncHandler(deleteCard));

export default router;

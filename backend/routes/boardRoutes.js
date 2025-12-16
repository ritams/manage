import express from 'express';
import { authMiddleware } from '../auth.js';
import {
    getBoard,
    createList,
    updateList,
    deleteList,
    reorderLists,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    reorderCards
} from '../controllers/boardController.js';

const router = express.Router();

// Apply auth middleware to all board routes
router.use(authMiddleware);

// Board/List operations
router.get('/board', getBoard);
router.post('/lists', createList);
router.put('/lists/reorder', reorderLists);
router.put('/lists/:id', updateList);
router.delete('/lists/:id', deleteList);

// Card operations
router.post('/cards', createCard);
router.put('/cards/reorder', reorderCards);
router.post('/cards/move', moveCard);
router.put('/cards/:id', updateCard);
router.delete('/cards/:id', deleteCard);

export default router;

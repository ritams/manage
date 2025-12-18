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
    reorderCards,
    getTags,
    createTag,
    updateTag,
    deleteTag,
    addTagToCard,
    removeTagFromCard
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

// Tag operations
router.get('/tags', getTags);
router.post('/tags', createTag);
router.put('/tags/:id', updateTag);
router.delete('/tags/:id', deleteTag);
router.post('/cards/tags', addTagToCard);
router.delete('/cards/tags', removeTagFromCard);

export default router;

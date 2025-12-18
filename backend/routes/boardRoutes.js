import express from 'express';
import { authMiddleware } from '../auth.js';
import {
    getBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    getLists,
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

// Board management operations
router.get('/boards', getBoards);           // Get all boards for user
router.post('/boards', createBoard);        // Create new board
router.put('/boards/:id', updateBoard);     // Update board (rename)
router.delete('/boards/:id', deleteBoard);  // Delete board

// List operations (renamed /board -> /lists for clarity, but keeping alias if needed or just changing)
// The original was router.get('/board', getBoard); which returned lists. 
// We will update it to take query param ?boardId=...
router.get('/lists', getLists);
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
router.delete('/cards/:cardId/tags/:tagId', removeTagFromCard);

export default router;

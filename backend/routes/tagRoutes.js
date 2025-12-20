import express from 'express';
import { authMiddleware } from '../auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
    getTags,
    createTag,
    updateTag,
    deleteTag,
    addTagToCard,
    removeTagFromCard
} from '../controllers/tagController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', asyncHandler(getTags));
router.post('/', asyncHandler(createTag));
router.put('/:id', asyncHandler(updateTag));
router.delete('/:id', asyncHandler(deleteTag));
router.post('/cards', asyncHandler(addTagToCard)); // This might need a better path, but matching old structure mostly
router.delete('/cards/:cardId/tags/:tagId', asyncHandler(removeTagFromCard));

export default router;

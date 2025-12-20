import express from 'express';
import { authMiddleware } from '../auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
    getLists,
    createList,
    updateList,
    deleteList,
    reorderLists
} from '../controllers/listController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', asyncHandler(getLists));
router.post('/', asyncHandler(createList));
router.put('/reorder', asyncHandler(reorderLists));
router.put('/:id', asyncHandler(updateList));
router.delete('/:id', asyncHandler(deleteList));

export default router;

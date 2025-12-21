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

// Validation
import { validate, schemas } from '../middleware/validate.js';

router.get('/', asyncHandler(getLists));
router.post('/', validate(schemas.createList), asyncHandler(createList));
router.put('/reorder', asyncHandler(reorderLists)); // reorderLists uses custom array validation
router.put('/:id', validate(schemas.updateList), asyncHandler(updateList));
router.delete('/:id', asyncHandler(deleteList));

export default router;

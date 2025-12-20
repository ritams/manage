import express from 'express';
import { authMiddleware } from '../auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
    getBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    getMembers,
    addMember,
    removeMember
} from '../controllers/boardController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', asyncHandler(getBoards));
router.post('/', asyncHandler(createBoard));
router.put('/:id', asyncHandler(updateBoard));
router.delete('/:id', asyncHandler(deleteBoard));

// Member management
router.get('/:id/members', asyncHandler(getMembers));
router.post('/:id/members', asyncHandler(addMember));
router.delete('/:id/members/:userId', asyncHandler(removeMember));

export default router;

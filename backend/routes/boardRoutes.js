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

// Validation
import { validate, schemas } from '../middleware/validate.js';

router.get('/', asyncHandler(getBoards));
router.post('/', validate(schemas.createBoard), asyncHandler(createBoard));
router.put('/:id', validate(schemas.updateBoard), asyncHandler(updateBoard));
router.delete('/:id', asyncHandler(deleteBoard));

// Member management
router.get('/:id/members', asyncHandler(getMembers));
router.post('/:id/members', validate(schemas.addMember), asyncHandler(addMember));
router.delete('/:id/members/:userId', asyncHandler(removeMember));

export default router;

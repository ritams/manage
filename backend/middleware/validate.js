import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (e) {
        if (e instanceof z.ZodError) {
            return res.status(400).json({
                error: "Validation failed",
                details: e.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        next(e);
    }
};

// Common schemas
export const schemas = {
    createBoard: z.object({
        name: z.string().min(1, "Name is required").max(100)
    }),
    updateBoard: z.object({
        name: z.string().min(1, "Name is required").max(100)
    }),
    createList: z.object({
        title: z.string().min(1, "Title is required").max(255),
        boardId: z.number().int().positive()
    }),
    updateList: z.object({
        title: z.string().min(1, "Title is required").max(255)
    }),
    createCard: z.object({
        listId: z.number().int().positive(),
        text: z.string().min(1, "Text is required").max(1000)
    }),
    updateCard: z.object({
        text: z.string().min(1, "Text is required").max(1000)
    }),
    moveCard: z.object({
        cardId: z.number().int(),
        listId: z.number().int()
    }),
    addMember: z.object({
        email: z.string().email()
    })
};

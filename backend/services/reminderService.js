import cron from 'node-cron';

import db from '../models/db.js';
import { getIO } from '../socket.js';

// Configure web-push with VAPID keys


// Send push notification to a user


// Check for due cards and send notifications
const checkDueCards = async () => {
    try {
        // Get local time in the same format as stored due_date (YYYY-MM-DDTHH:mm)
        const now = new Date();
        const localNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        console.log(`[Reminder] Checking for due cards at ${localNow}`);

        // Find cards that are due (due_date <= now) and haven't been notified
        // Compare as strings since due_date is stored as 'YYYY-MM-DDTHH:mm' format
        const dueCards = await db.query(
            `SELECT c.id, c.text, c.due_date, c.list_id, l.board_id, b.user_id as owner_id
             FROM cards c
             JOIN lists l ON c.list_id = l.id
             JOIN boards b ON l.board_id = b.id
             WHERE c.due_date IS NOT NULL 
               AND c.due_date <= ?
               AND c.notification_sent = 0`,
            [localNow]
        );

        console.log(`[Reminder] Found ${dueCards.length} due cards`);

        for (const card of dueCards) {
            console.log(`[Reminder] Processing card ${card.id}: "${card.text}" due at ${card.due_date}`);

            // Get all users who have access to this board (owner + members)
            const users = await db.query(
                `SELECT user_id FROM (
                    SELECT user_id FROM boards WHERE id = ?
                    UNION
                    SELECT user_id FROM board_members WHERE board_id = ?
                )`,
                [card.board_id, card.board_id]
            );

            const message = `Task "${card.text.substring(0, 50)}${card.text.length > 50 ? '...' : ''}" is due!`;

            for (const user of users) {
                // Create in-app notification
                await db.run(
                    `INSERT INTO notifications (user_id, card_id, board_id, message)
                     VALUES (?, ?, ?, ?)`,
                    [user.user_id, card.id, card.board_id, message]
                );
                console.log(`[Reminder] Created notification for user ${user.user_id}`);



                // Emit socket event for real-time in-app notification
                // Emit to ALL connected sockets since user might not be viewing the specific board
                console.log(`[Reminder] Emitting NEW_NOTIFICATION to all sockets for user ${user.user_id}`);
                getIO().emit('NEW_NOTIFICATION', {
                    userId: user.user_id,
                    message: message,
                    cardId: card.id,
                    boardId: card.board_id
                });

                // Also emit BOARD_UPDATED to refresh the card data (update due date badge)
                getIO().to(`board_${card.board_id}`).emit('BOARD_UPDATED');
            }

            // Mark card as notified
            await db.run(
                "UPDATE cards SET notification_sent = 1 WHERE id = ?",
                [card.id]
            );

            console.log(`[Reminder] ✓ Notification sent for card ${card.id}`);
        }
    } catch (err) {
        console.error('[Reminder] Error checking due cards:', err);
    }
};

// Initialize the reminder service
export const initReminderService = () => {


    // Run every minute
    cron.schedule('* * * * *', () => {
        checkDueCards();
    });

    console.log(`Reminder service started`);
};

export default { initReminderService };

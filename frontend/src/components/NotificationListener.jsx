import { useEffect } from 'react';
import { useSocket } from '@/context/SocketProvider';
import { useToast } from './ToastProvider';

// This component listens for notification socket events and triggers toasts
export default function NotificationListener({ user, onBoardUpdate }) {
    const socket = useSocket();
    const { showNotification } = useToast();

    useEffect(() => {
        if (!socket || !user) return;

        const handleNewNotification = async (payload) => {
            // Filter by user ID if payload has it (prevent duplicates from global emit)
            if (payload?.userId && payload.userId !== user.id) {
                return;
            }

            console.log('[NotificationListener] Received NEW_NOTIFICATION', payload);

            // Show toast notification
            showNotification(payload.message || 'You have a task due!', {
                title: '⏰ Task Reminder',
                type: 'reminder',
                duration: 6000
            });

            // Trigger board data refresh if callback provided
            if (onBoardUpdate) {
                onBoardUpdate();
            }
        };

        socket.on('NEW_NOTIFICATION', handleNewNotification);

        return () => {
            socket.off('NEW_NOTIFICATION', handleNewNotification);
        };
    }, [socket, showNotification, onBoardUpdate]);

    return null; // This component doesn't render anything
}

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useSocket } from '@/context/SocketProvider';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();

    const fetchNotifications = useCallback(async () => {
        try {
            const data = await api.notifications.get();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const data = await api.notifications.getUnreadCount();
            setUnreadCount(data.count);
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
        }
    }, []);

    const markAsRead = useCallback(async (id) => {
        try {
            await api.notifications.markRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await api.notifications.markAllRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    }, []);

    // Initial fetch on mount
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Listen for real-time notification updates via socket
    useEffect(() => {
        if (!socket) {
            console.log('[Notifications] No socket available');
            return;
        }

        console.log('[Notifications] Setting up socket listener for NEW_NOTIFICATION');

        const handleNewNotification = () => {
            console.log('[Notifications] Received NEW_NOTIFICATION event!');
            // Refresh notifications when server signals a new one
            fetchNotifications();
        };

        socket.on('NEW_NOTIFICATION', handleNewNotification);

        return () => {
            console.log('[Notifications] Cleaning up socket listener');
            socket.off('NEW_NOTIFICATION', handleNewNotification);
        };
    }, [socket, fetchNotifications]);

    return {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
    };
};

export default useNotifications;


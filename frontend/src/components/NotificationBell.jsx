import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNotifications } from '@/hooks/useNotifications';

import { cn } from '@/lib/utils';

export default function NotificationBell({ onNavigateToBoard }) {
    const {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        fetchNotifications
    } = useNotifications();



    const [isOpen, setIsOpen] = useState(false);

    // Refresh notifications when popover opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, fetchNotifications]);

    const formatTime = (dateString) => {
        if (!dateString) return '';

        // SQLite typically returns UTC strings without 'Z'
        // We append 'Z' to ensure it's treated as UTC, preventing timezone offset errors
        let parseString = dateString;
        if (typeof dateString === 'string' && !dateString.endsWith('Z') && !dateString.includes('+')) {
            parseString = dateString.replace(' ', 'T') + 'Z';
        }

        const date = new Date(parseString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const handleNotificationClick = (notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        if (onNavigateToBoard && notification.board_id) {
            onNavigateToBoard(notification.board_id);
        }
        setIsOpen(false);
    };



    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full relative text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                >
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-80 sm:w-96 p-0 rounded-2xl bg-card/98 backdrop-blur-2xl border-border/50 shadow-2xl overflow-hidden"
                align="end"
                sideOffset={8}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-primary gap-1"
                        >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all read
                        </Button>
                    )}
                </div>

                {/* Notification List */}
                <div className="max-h-64 overflow-y-auto scrollbar-thin">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                            <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mb-2">
                                <Bell className="w-5 h-5 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">No notifications</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                                Set due dates to get reminders
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border/20">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={cn(
                                        "w-full text-left px-4 py-3 transition-colors hover:bg-muted/50 cursor-pointer",
                                        !notification.is_read && "bg-primary/5"
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full mt-1.5 shrink-0",
                                            notification.is_read ? "bg-muted-foreground/30" : "bg-primary"
                                        )} />
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-sm leading-snug",
                                                notification.is_read ? "text-muted-foreground" : "text-foreground font-medium"
                                            )}>
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {notification.board_name && (
                                                    <span className="text-xs text-muted-foreground/70 truncate">
                                                        {notification.board_name}
                                                    </span>
                                                )}
                                                <span className="text-xs text-muted-foreground/50">
                                                    {formatTime(notification.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                        {!notification.is_read && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(notification.id);
                                                }}
                                                className="h-6 w-6 shrink-0 text-muted-foreground hover:text-primary"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


            </PopoverContent>
        </Popover >
    );
}


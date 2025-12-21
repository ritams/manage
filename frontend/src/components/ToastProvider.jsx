import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Bell, X, Clock } from 'lucide-react';

// Context for toast notifications
const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

// Individual Toast component
function Toast({ toast, onDismiss }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        setTimeout(() => setIsVisible(true), 10);

        // Auto dismiss after duration
        const timer = setTimeout(() => {
            handleDismiss();
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsLeaving(true);
        setTimeout(() => onDismiss(toast.id), 300);
    };

    return (
        <div
            className={cn(
                "transform transition-all duration-300 ease-out",
                isVisible && !isLeaving
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
            )}
        >
            <div className={cn(
                "flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-xl max-w-sm",
                "bg-card/95 border-border/50"
            )}>
                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    toast.type === 'reminder' ? "bg-amber-100 dark:bg-amber-900/30" : "bg-primary/10"
                )}>
                    {toast.type === 'reminder' ? (
                        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    ) : (
                        <Bell className="w-5 h-5 text-primary" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground">
                        {toast.title || 'Notification'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {toast.message}
                    </p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// Toast Provider & Container
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { ...toast, id }]);

        // Play notification sound
        playNotificationSound();

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showNotification = useCallback((message, options = {}) => {
        return addToast({
            message,
            title: options.title || 'Task Due',
            type: options.type || 'reminder',
            duration: options.duration || 5000
        });
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ showNotification, addToast, removeToast }}>
            {children}
            {/* Toast Container - Fixed to right side */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast toast={toast} onDismiss={removeToast} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// Notification sound utility
function playNotificationSound() {
    try {
        // Create a simple notification beep using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);

        // Second beep
        setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.frequency.value = 1000;
            osc2.type = 'sine';
            gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            osc2.start(audioContext.currentTime);
            osc2.stop(audioContext.currentTime + 0.2);
        }, 150);
    } catch (e) {
        console.log('Could not play notification sound:', e);
    }
}

export default ToastProvider;

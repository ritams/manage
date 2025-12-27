import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Card as ShadcnCard, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X, Check, MoreHorizontal, Trash, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import DateTimePicker from "./DateTimePicker";
import { motion, AnimatePresence } from "framer-motion";

export default function Card({ card, onDelete, onUpdate, onRemoveTag, onSetDueDate }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: `card-${card.id}`,
        data: { type: "Card", card }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(card.text);

    // Get due date status
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        if (!card.due_date) return;

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 30000);

        return () => clearInterval(timer);
    }, [card.due_date]);

    const getDueDateStatus = () => {
        if (!card.due_date) return null;
        const dueDate = new Date(card.due_date);
        const now = currentTime;
        const diffMs = dueDate - now;
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffMs < 0) return 'overdue';
        if (diffHours <= 24) return 'today';
        if (diffHours <= 72) return 'soon';
        return 'upcoming';
    };

    const dueDateStatus = getDueDateStatus();

    const formatDueDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
        const isTomorrow = date.toDateString() === tomorrow.toDateString();

        if (isToday) return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        if (isTomorrow) return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const handleSetDueDate = (date) => {
        if (onSetDueDate) {
            const dateStr = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` : null;
            onSetDueDate(card.id, dateStr);
        }
    };

    const handleSave = () => {
        setIsEditing(false);
        if (text.trim() && text !== card.text) {
            onUpdate(text);
        } else {
            setText(card.text);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") {
            setIsEditing(false);
            setText(card.text);
        }
    };

    const renderTextWithLinks = (text) => {
        if (!text) return null;
        const urlPattern = /((?:https?:\/\/|www\.)[^\s]+|[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
        const parts = text.split(urlPattern);

        return parts.map((part, index) => {
            if (part.match(urlPattern)) {
                let href = part;
                if (!part.startsWith('http://') && !part.startsWith('https://')) {
                    href = `https://${part}`;
                }

                return (
                    <a
                        key={index}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline decoration-primary/30 hover:decoration-primary break-all relative z-50 hover:text-primary/80 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    if (isEditing) {
        return (
            <motion.div
                ref={setNodeRef}
                style={style}
                className="relative z-20 group/card"
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.15 }}
            >
                <div className="bg-card/90 backdrop-blur-xl border-2 border-primary/40 shadow-2xl rounded-[1.25rem] sm:rounded-[1.5rem] p-3 animate-in fade-in zoom-in-95 duration-200">
                    <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className="h-10 text-sm bg-background border-border/50 mb-3 rounded-xl font-medium px-3"
                    />
                    <div className="flex justify-end gap-2">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                size="sm"
                                className="h-8 px-4 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-lg shadow-primary/20"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={handleSave}
                            >
                                Update Task
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="group/card relative">
            <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.15 }}
            >
                <ShadcnCard className="bg-card/70 backdrop-blur-md border border-border/40 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/25 transition-all duration-300 cursor-grab active:cursor-grabbing rounded-xl sm:rounded-2xl overflow-hidden group">
                    <CardContent
                        className="p-3 sm:p-4 text-sm font-semibold text-foreground/80 leading-relaxed break-words relative pr-10 cursor-pointer"
                        onClick={() => setIsEditing(true)}
                    >
                        <div className="flex flex-col gap-2 w-full">
                            {/* Tags */}
                            <AnimatePresence>
                                {card.tags && card.tags.length > 0 && (
                                    <motion.div
                                        className="flex flex-wrap gap-1.5 mb-1"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {card.tags.map((tag, index) => (
                                            <motion.div
                                                key={tag.id}
                                                className="group/tag relative flex items-center"
                                                onPointerDown={(e) => e.stopPropagation()}
                                                onClick={(e) => e.stopPropagation()}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ delay: index * 0.03 }}
                                            >
                                                <div
                                                    className="flex items-center px-2.5 py-0.5 rounded-full border shadow-sm transition-all hover:scale-105"
                                                    style={{ backgroundColor: `${tag.color}20`, borderColor: `${tag.color}40` }}
                                                >
                                                    <span className="text-[10px] font-bold" style={{ color: tag.color }}>{tag.name}</span>
                                                </div>
                                                <motion.button
                                                    className="absolute -right-1.5 -top-1.5 w-4 h-4 bg-background border border-border rounded-full flex items-center justify-center opacity-0 group-hover/tag:opacity-100 transition-all hover:bg-destructive hover:border-destructive group/del shadow-sm z-10"
                                                    onClick={() => onRemoveTag && onRemoveTag(card.id, tag.id)}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <X className="w-2.5 h-2.5 text-muted-foreground group-hover/del:text-white" />
                                                </motion.button>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Card text */}
                            <span className="flex-1">{renderTextWithLinks(card.text)}</span>

                            {/* Due Date Badge */}
                            <AnimatePresence>
                                {card.due_date && (
                                    <motion.div
                                        className={cn(
                                            "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold w-fit",
                                            dueDateStatus === 'overdue' && "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400",
                                            dueDateStatus === 'today' && "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
                                            dueDateStatus === 'soon' && "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
                                            dueDateStatus === 'upcoming' && "bg-muted text-muted-foreground"
                                        )}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                    >
                                        <motion.div
                                            animate={dueDateStatus === 'overdue' ? { scale: [1, 1.2, 1] } : {}}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        >
                                            <Clock className="w-3 h-3" />
                                        </motion.div>
                                        <span>{formatDueDate(card.due_date)}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* More options button */}
                        <div className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover/card:opacity-100 transition-all transform translate-x-0 md:translate-x-2 md:group-hover/card:translate-x-0 z-10">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                            onPointerDown={(e) => e.stopPropagation()}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-1.5 rounded-xl border-border/50 shadow-xl backdrop-blur-xl bg-card/95" align="end" onPointerDown={(e) => e.stopPropagation()}>
                                    {/* Due Date Section */}
                                    <div className="px-2 py-2 border-b border-border/30 mb-1">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Due Date</div>
                                        <div onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                                            <DateTimePicker
                                                selected={card.due_date ? new Date(card.due_date) : null}
                                                onChange={handleSetDueDate}
                                                placeholder="Pick date & time"
                                            />
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-9 font-bold text-xs gap-2 rounded-lg"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Trash className="w-3.5 h-3.5" /> Delete Task
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="rounded-2xl" onPointerDown={(e) => e.stopPropagation()}>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This task will be permanently removed.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="rounded-xl font-bold" onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={(e) => { e.stopPropagation(); onDelete(); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold">
                                                    Delete Task
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </CardContent>
                </ShadcnCard>
            </motion.div>
        </div>
    );
}

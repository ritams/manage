import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card as ShadcnCard, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X, Check, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
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

export default function Card({ card, onDelete, onUpdate }) {
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

    if (isEditing) {
        return (
            <div ref={setNodeRef} style={style} className="relative z-20 group/card">
                <div className="bg-card/80 backdrop-blur-xl border-2 border-primary/40 shadow-2xl rounded-[1.5rem] p-3 animate-in fade-in zoom-in-95 duration-200">
                    <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className="h-10 text-sm bg-background border-border/50 mb-3 rounded-xl font-medium px-3"
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            size="sm"
                            className="h-8 px-4 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-lg shadow-primary/20"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleSave}
                        >
                            Update Task
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="group/card relative">
            <ShadcnCard className="bg-card/60 backdrop-blur-md border border-border/40 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden group">
                <CardContent
                    className="p-4 text-sm font-semibold text-foreground/80 leading-relaxed break-words relative pr-10 cursor-pointer"
                    onClick={() => setIsEditing(true)}
                >
                    <div className="flex items-start gap-2">
                        <span className="flex-1">{card.text}</span>
                    </div>

                    <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-all transform translate-x-2 group-hover/card:translate-x-0 z-10">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-40 p-1 rounded-xl border-border/50 shadow-xl backdrop-blur-xl bg-card/90" align="end" onPointerDown={(e) => e.stopPropagation()}>
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
        </div>
    );
}

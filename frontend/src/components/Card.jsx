import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card as ShadcnCard, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
                <CardContent className="p-4 text-sm font-semibold text-foreground/80 leading-relaxed break-words relative pr-10">
                    <div className="flex items-start gap-2">
                        <div className="w-1 h-5 rounded-full bg-primary/20 mt-0.5 group-hover:bg-primary transition-colors" />
                        <span className="flex-1">{card.text}</span>
                    </div>

                    <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-all transform translate-x-2 group-hover/card:translate-x-0 flex flex-col gap-1 bg-card/40 backdrop-blur-md rounded-xl p-1 border border-border/40 shadow-xl">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => setIsEditing(true)}
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </CardContent>
            </ShadcnCard>
        </div>
    );
}

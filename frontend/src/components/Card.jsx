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
        opacity: isDragging ? 0.5 : 1,
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
            <div ref={setNodeRef} style={style} className="relative z-10" {...attributes} {...listeners}>
                <div className="bg-card border border-primary/50 shadow-sm rounded-xl p-2 animate-in fade-in zoom-in-95 duration-100">
                    <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className="h-8 text-sm bg-background border-border/50 mb-2"
                    />
                    <div className="flex justify-end gap-1">
                        <Button
                            size="sm"
                            className="h-6 px-2 text-xs bg-primary hover:bg-primary/90"
                            onMouseDown={(e) => e.preventDefault()} // Prevent blur
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="group/card relative">
            <ShadcnCard className="bg-card border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-grab active:cursor-grabbing group-hover/card:translate-y-[-1px]">
                <CardContent className="p-3 text-sm font-medium text-foreground/90 leading-relaxed break-words relative pr-8">
                    {card.text}

                    <div className="absolute top-1 right-1 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col gap-0.5 bg-card/80 backdrop-blur-sm rounded-md p-0.5 border border-border/50 shadow-sm">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-sm"
                            onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
                            onClick={() => setIsEditing(true)}
                        >
                            <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-sm"
                            onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </CardContent>
            </ShadcnCard>
        </div>
    );
}

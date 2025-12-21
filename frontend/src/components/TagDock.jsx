import { useDraggable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Settings2, X, Trash2, Tag, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

function DraggableTag({ tag }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `tag-${tag.id}`,
        data: { type: "Tag", tag }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
            <Badge
                className="px-3 py-1.5 rounded-full text-xs font-bold border-none shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                style={{ backgroundColor: tag.color, color: '#fff' }}
            >
                {tag.name}
            </Badge>
        </div>
    );
}

export default function TagDock({ tags, onCreateTag, onDeleteTag }) {
    const [isManaging, setIsManaging] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [newName, setNewName] = useState("");
    const [newColor, setNewColor] = useState("#3b82f6");

    const colors = [
        "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6366f1", "#14b8a6"
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newName.trim()) {
            onCreateTag(newName, newColor);
            setNewName("");
        }
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 transition-all duration-300">
            {/* Mobile Toggle Button */}
            <div className={`md:hidden transition-all duration-300 ${isExpanded ? 'translate-y-0' : 'translate-y-8'}`}>
                <Button
                    onClick={() => setIsExpanded(!isExpanded)}
                    size="sm"
                    className="rounded-full shadow-2xl bg-card/80 backdrop-blur-xl border border-primary/20 text-primary hover:bg-card h-10 px-6 font-bold"
                >
                    {isExpanded ? <ChevronDown className="w-4 h-4 mr-2" /> : <Tag className="w-4 h-4 mr-2" />}
                    {isExpanded ? "Hide Tags" : "Tags"}
                </Button>
            </div>

            {/* Dock Content */}
            <div className={`
                bg-card/40 backdrop-blur-2xl border border-border/40 p-4 rounded-[2rem] shadow-2xl items-center gap-3 max-w-[90vw] overflow-x-auto no-scrollbar ring-1 ring-border/10 transition-all duration-500 origin-bottom
                ${isExpanded ? 'flex opacity-100 scale-100 translate-y-0' : 'hidden opacity-0 scale-95 translate-y-10'}
                md:flex md:opacity-100 md:scale-100 md:translate-y-0
            `}>
                <div className="flex items-center gap-2 px-2 overflow-x-auto no-scrollbar">
                    {tags.map(tag => (
                        <DraggableTag key={tag.id} tag={tag} />
                    ))}
                    {tags.length === 0 && (
                        <span className="text-xs text-muted-foreground px-4 font-medium italic">No tags yet</span>
                    )}
                </div>

                <div className="w-px h-6 bg-border/20 mx-1 shrink-0" />

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0"
                        >
                            <Settings2 className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl border-border/40 bg-card/90 backdrop-blur-xl text-foreground">
                        <DialogHeader>
                            <DialogTitle>Manage Tags</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="New tag name..."
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="bg-secondary/50 border-border/40 rounded-xl"
                                />
                                <div className="flex gap-1 items-center px-2 bg-secondary/50 rounded-xl border border-border/40">
                                    {colors.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            className={`w-6 h-6 rounded-full border-2 transition-all ${newColor === c ? 'border-primary scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                            style={{ backgroundColor: c }}
                                            onClick={() => setNewColor(c)}
                                        />
                                    ))}
                                </div>
                                <Button type="submit" size="icon" className="shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>

                        <div className="mt-6 space-y-2 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
                            {tags.map(tag => (
                                <div key={tag.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-2xl border border-border/20 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                                        <span className="font-semibold text-sm tracking-tight">{tag.name}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                        onClick={() => onDeleteTag(tag.id)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

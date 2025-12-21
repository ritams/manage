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
            <div
                className="flex items-center px-3 py-1 rounded-full border shadow-sm transition-all hover:scale-105"
                style={{ backgroundColor: `${tag.color}20`, borderColor: `${tag.color}40` }}
            >
                <span className="text-xs font-bold whitespace-nowrap" style={{ color: tag.color }}>{tag.name}</span>
            </div>
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
            <div className={`md:hidden transition-all duration-300`}>
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
                bg-card/40 backdrop-blur-2xl border border-border/40 p-2 rounded-[2rem] shadow-2xl items-center gap-3 max-w-[90vw] overflow-x-auto scrollbar-hidden ring-1 ring-border/10 transition-all duration-500 origin-bottom
                ${isExpanded ? 'flex opacity-100 scale-100 translate-y-0' : 'hidden opacity-0 scale-95 translate-y-10'}
                md:flex md:opacity-100 md:scale-100 md:translate-y-0
            `}>
                <div className="flex items-center gap-2 px-2 overflow-x-auto scrollbar-hidden">
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
                    <DialogContent
                        className="rounded-3xl border-border/40 bg-card/95 backdrop-blur-xl text-foreground w-[95vw] max-w-sm p-6 !data-[state=open]:!slide-in-from-top-0 !data-[state=closed]:!slide-out-to-top-0"
                        style={{ '--tw-enter-translate-y': '20%', '--tw-exit-translate-y': '20%', '--tw-enter-translate-x': '0%', '--tw-exit-translate-x': '0%' }}
                    >
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold font-heading">Manage Tags</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 mt-2">
                            {/* Existing Tags List - Minimal & Fluid */}
                            <div className="flex flex-wrap gap-2 max-h-[30vh] overflow-y-auto pr-1 scrollbar-thin p-1">
                                {tags.length === 0 ? (
                                    <div className="w-full text-center py-4 text-muted-foreground italic text-sm">No tags yet.</div>
                                ) : (
                                    tags.map(tag => (
                                        <div
                                            key={tag.id}
                                            className="group flex items-center pl-3 pr-1 py-1 rounded-full border shadow-sm transition-all hover:pr-2"
                                            style={{ backgroundColor: `${tag.color}20`, borderColor: `${tag.color}40` }}
                                        >
                                            <span className="text-xs font-bold mr-1" style={{ color: tag.color }}>{tag.name}</span>
                                            <button
                                                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
                                                onClick={() => onDeleteTag(tag.id)}
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="h-px bg-border/20" />

                            {/* Minimal Creator */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="New tag..."
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="bg-secondary/30 border-border/20 rounded-xl h-10 text-sm font-medium px-4 focus-visible:ring-1 focus-visible:ring-primary/30"
                                    />
                                    <Button type="submit" size="icon" className="shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 h-10 w-10" disabled={!newName.trim()}>
                                        <Plus className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="flex justify-between items-center px-1">
                                    {colors.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            className={`w-6 h-6 rounded-full transition-all duration-300 ${newColor === c ? 'scale-125 ring-2 ring-offset-2 ring-primary ring-offset-card' : 'hover:scale-110 opacity-60 hover:opacity-100'}`}
                                            style={{ backgroundColor: c }}
                                            onClick={() => setNewColor(c)}
                                        />
                                    ))}
                                </div>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

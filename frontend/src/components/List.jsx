import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Card from "./Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MoreHorizontal, Trash, X, Sparkles } from "lucide-react";
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

export default function List({ list, onAddCard, onDeleteList, onUpdateList, onDeleteCard, onUpdateCard, onRemoveTag, onSetDueDate, isOverlay }) {
    const {
        setNodeRef,
        setActivatorNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: `list-${list.id}`,
        data: { type: "List", list }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardText, setNewCardText] = useState("");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(list.title);

    const handleAddCard = async (e) => {
        e.preventDefault();
        if (!newCardText.trim()) return;
        await onAddCard(list.id, newCardText);
        setNewCardText("");
        setIsAddingCard(false);
    };

    const handleTitleUpdate = () => {
        setIsEditingTitle(false);
        if (title.trim() && title !== list.title) {
            onUpdateList(list.id, title);
        } else {
            setTitle(list.title);
        }
    };

    if (isOverlay) {
        return (
            <div className="w-[85vw] md:w-80 shrink-0 flex flex-col opacity-90 scale-105 rotate-3 cursor-grabbing z-50">
                <div className="bg-card/60 backdrop-blur-3xl border-2 border-primary/40 p-4 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col gap-4">
                    <div className="flex justify-between items-center px-2">
                        <div className="text-base font-bold font-heading text-foreground truncate">{list.title}</div>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">{list.cards.length}</span>
                    </div>
                    <div className="px-1 space-y-3">
                        {list.cards.map((card) => (
                            <Card key={card.id} card={card} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`w-[85vw] md:w-80 shrink-0 flex flex-col transition-all duration-300 snap-center ${isDragging ? "opacity-20 scale-95" : "opacity-100"}`}
        >
            <div
                className="bg-card/30 backdrop-blur-2xl border border-border/40 p-4 rounded-[2rem] shadow-xl shadow-black/5 flex flex-col gap-4 group/list transition-all hover:bg-card/50 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
            >

                {/* List Header */}
                <div
                    className="flex justify-between items-center px-1 group/header relative"
                >
                    <div
                        ref={setActivatorNodeRef}
                        {...attributes}
                        {...listeners}
                        className="absolute -inset-2 cursor-grab active:cursor-grabbing z-0"
                    />

                    <div className="flex-1 z-10 mr-2">
                        {isEditingTitle ? (
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={handleTitleUpdate}
                                onKeyDown={(e) => e.key === 'Enter' && handleTitleUpdate()}
                                autoFocus
                                onPointerDown={(e) => e.stopPropagation()}
                                className="h-8 text-sm font-bold px-2 bg-background/50 border-primary/30 focus-visible:ring-primary/20 rounded-lg"
                            />
                        ) : (
                            <div
                                className="text-sm font-extrabold font-heading text-foreground/90 cursor-pointer py-1 truncate flex items-center gap-2 group-hover/list:text-primary transition-colors"
                                onClick={() => setIsEditingTitle(true)}
                            >
                                {list.title}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 z-10">
                        <span className="text-[10px] font-bold text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-full border border-border/50">
                            {list.cards.length}
                        </span>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full opacity-100 md:opacity-0 md:group-hover/list:opacity-100 transition-all hover:bg-primary/10 hover:text-primary">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-1 rounded-xl border-border/50 shadow-xl backdrop-blur-xl bg-card/90" align="start">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-9 font-bold text-xs gap-2 rounded-lg"
                                        >
                                            <Trash className="w-3.5 h-3.5" /> Delete Collection
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-2xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete this collection?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently remove "{list.title}" and all its tasks. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="rounded-xl font-bold">Nevermind</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => onDeleteList(list.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold">
                                                Delete Everything
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Cards Container */}
                <div className="pr-1 space-y-3 py-1">
                    <SortableContext items={list.cards.map(c => `card-${c.id}`)} strategy={verticalListSortingStrategy}>
                        {list.cards.map((card) => (
                            <Card
                                key={card.id}
                                card={card}
                                onDelete={() => onDeleteCard(card.id)}
                                onUpdate={(text) => onUpdateCard(card.id, text)}
                                onRemoveTag={onRemoveTag}
                                onSetDueDate={onSetDueDate}
                            />
                        ))}
                    </SortableContext>
                </div>

                {/* Add Card Footer */}
                <div className="pt-2">
                    {
                        isAddingCard ? (
                            <form onSubmit={handleAddCard} className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3 p-1">
                                <Input
                                    autoFocus
                                    placeholder="Task description..."
                                    value={newCardText}
                                    onChange={(e) => setNewCardText(e.target.value)}
                                    className="bg-background/80 border-border/50 text-sm shadow-inner rounded-xl h-10 px-3 font-medium transition-all focus:border-primary/50"
                                />
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <Button type="submit" size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-4 font-bold rounded-lg">Add Task</Button>
                                        <Button type="button" variant="ghost" size="sm" className="h-8 px-3 text-xs font-bold rounded-lg" onClick={() => setIsAddingCard(false)}>Cancel</Button>
                                    </div>
                                    <Sparkles className="w-4 h-4 text-primary/40" />
                                </div>
                            </form>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/5 h-10 text-xs font-bold rounded-xl border border-transparent hover:border-primary/10 transition-all group/add"
                                onClick={() => setIsAddingCard(true)}
                            >
                                <div className="w-6 h-6 rounded-full bg-secondary/80 flex items-center justify-center mr-2 group-hover/add:bg-primary/10 group-hover/add:text-primary transition-colors">
                                    <Plus className="h-3.5 w-3.5" />
                                </div>
                                <span>New Task</span>
                            </Button>
                        )
                    }
                </div>
            </div >
        </div >
    );
}


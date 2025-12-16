import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Card from "./Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MoreHorizontal, Trash, X } from "lucide-react";
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

export default function List({ list, onAddCard, onDeleteList, onUpdateList, onDeleteCard, onUpdateCard, isOverlay }) {
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
            <div className="w-80 shrink-0 flex flex-col max-h-full opacity-80 rotate-2 cursor-grabbing">
                <div className="bg-card/40 backdrop-blur-xl border border-primary/50 p-3 rounded-2xl shadow-2xl flex flex-col gap-3">
                    <div className="flex justify-between items-center px-1">
                        <div className="text-sm font-bold font-heading text-foreground/90 py-1 truncate">{list.title}</div>
                        <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full border border-border/30">{list.cards.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto px-1 min-h-[50px] space-y-2 thin-scrollbar p-1">
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
            className={`w-80 shrink-0 flex flex-col max-h-full ${isDragging ? "opacity-30" : ""}`}
        >
            <div
                className="bg-card/40 backdrop-blur-xl border border-border/50 p-3 rounded-2xl shadow-2xl shadow-black/5 flex flex-col gap-3 group/list transition-all hover:bg-card/60 hover:border-border/60 hover:shadow-primary/5"
            >

                {/* List Header */}
                <div
                    ref={setActivatorNodeRef}
                    {...attributes}
                    {...listeners}
                    className="flex justify-between items-center px-1 cursor-grab active:cursor-grabbing outline-none"
                >
                    {isEditingTitle ? (
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleUpdate}
                            onKeyDown={(e) => e.key === 'Enter' && handleTitleUpdate()}
                            autoFocus
                            // Stop propagation to prevent drag start when clicking input
                            onPointerDown={(e) => e.stopPropagation()}
                            className="h-7 text-sm font-bold px-1 bg-transparent border-primary/50 focus-visible:ring-0"
                        />
                    ) : (
                        <div
                            className="text-sm font-bold font-heading text-foreground/90 cursor-pointer flex-1 py-1 truncate"
                            onClick={() => setIsEditingTitle(true)}
                        >
                            {list.title}
                        </div>
                    )}

                    <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full border border-border/30">
                            {list.cards.length}
                        </span>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/list:opacity-100 transition-opacity">
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-40 p-1" align="start">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 font-normal text-xs"
                                        >
                                            <Trash className="mr-2 h-3 w-3" /> Delete List
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete list?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. All cards in this list will be permanently deleted.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => onDeleteList(list.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto px-1 min-h-[50px] space-y-2 thin-scrollbar p-1">
                    <SortableContext items={list.cards.map(c => `card-${c.id}`)} strategy={verticalListSortingStrategy}>
                        {list.cards.map((card) => (
                            <Card
                                key={card.id}
                                card={card}
                                onDelete={() => onDeleteCard(card.id)}
                                onUpdate={(text) => onUpdateCard(card.id, text)}
                            />
                        ))}
                    </SortableContext>
                </div>

                {/* Add Card */}
                {
                    isAddingCard ? (
                        <form onSubmit={handleAddCard} className="animate-in fade-in slide-in-from-top-2 duration-200">
                            <Input
                                autoFocus
                                placeholder="Card title..."
                                value={newCardText}
                                onChange={(e) => setNewCardText(e.target.value)}
                                className="mb-2 bg-background/80 border-border/50 text-sm shadow-sm"
                            />
                            <div className="flex gap-2">
                                <Button type="submit" size="sm" className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm px-3">Add</Button>
                                <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setIsAddingCard(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start text-muted-foreground hover:text-foreground hover:bg-secondary/40 h-8 text-sm font-normal rounded-lg"
                            onClick={() => setIsAddingCard(true)}
                        >
                            <Plus className="mr-2 h-3 w-3" /> Add a card
                        </Button>
                    )
                }
            </div >
        </div >
    );
}



import { useState, useEffect } from "react";
import {
    DndContext,
    closestCorners,
    DragOverlay,
    defaultDropAnimationSideEffects,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    MeasuringStrategy
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { api } from "@/lib/api";
import List from "./List";
import Card from "./Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Board({ user, onLogout }) {
    const [lists, setLists] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [activeList, setActiveList] = useState(null);
    const [activeCard, setActiveCard] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [isAddingList, setIsAddingList] = useState(false);
    const [newListTitle, setNewListTitle] = useState("");

    useEffect(() => {
        loadBoard();
    }, []);

    const loadBoard = async () => {
        try {
            const data = await api.board.get();
            setLists(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateList = async (e) => {
        e.preventDefault();
        if (!newListTitle.trim()) return;
        try {
            await api.lists.create(newListTitle);
            setNewListTitle("");
            setIsAddingList(false);
            loadBoard();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteList = async (listId) => {

        try {
            await api.lists.delete(listId);
            loadBoard();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateList = async (listId, title) => {
        try {
            await api.lists.update(listId, title);
            loadBoard(); // Optimistic update would be better but this is fine
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddCard = async (listId, text) => {
        try {
            await api.cards.create(listId, text);
            loadBoard();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteCard = async (cardId) => {
        try {
            await api.cards.delete(cardId);
            loadBoard();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateCard = async (cardId, text) => {
        try {
            await api.cards.update(cardId, text);
            loadBoard();
        } catch (err) {
            console.error(err);
        }
    };


    // Helper functions for ID namespacing
    const formatListId = (id) => `list-${id}`;
    const formatCardId = (id) => `card-${id}`;
    const parseId = (id) => {
        if (!id) return null;
        if (typeof id === 'number') return id; // Already parsed or raw?
        const parts = id.toString().split('-');
        return parts.length > 1 ? parseInt(parts[1]) : id;
    };

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);

        if (active.data.current?.type === "List") {
            setActiveList(active.data.current.list);
        } else {
            setActiveCard(active.data.current.card);
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);
        setActiveList(null);
        setActiveCard(null);

        if (!over) return;

        const activeIdStr = active.id;
        const overIdStr = over.id;

        if (activeIdStr === overIdStr) return;

        const isActiveList = active.data.current?.type === "List";

        if (isActiveList) {
            setLists((items) => {
                const oldIndex = items.findIndex((l) => formatListId(l.id) === activeIdStr);

                let overListIdStr = overIdStr;
                // If over is a Card, find its parent List
                if (over.data.current?.type === "Card") {
                    const overCardId = parseId(overIdStr);
                    const overList = items.find(l => l.cards.find(c => c.id === overCardId));
                    if (overList) {
                        overListIdStr = formatListId(overList.id);
                    }
                }

                const newIndex = items.findIndex((l) => formatListId(l.id) === overListIdStr);

                if (oldIndex === -1 || newIndex === -1) return items;

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Sync to backend
                api.lists.reorder(newItems.map(l => l.id)).catch(console.error);

                return newItems;
            });
            return;
        }

        const activeCardId = parseId(activeIdStr);
        const overIdParsed = parseId(overIdStr);

        // Find source and dest list
        let sourceList = lists.find(l => l.cards.find(c => c.id === activeCardId));
        let destList = null;

        // Check if over is a list
        if (over.data.current?.type === "List") {
            destList = lists.find(l => l.id === overIdParsed);
        } else if (over.data.current?.type === "Card") {
            // Over is a card, find its list
            destList = lists.find(l => l.cards.find(c => c.id === overIdParsed));
        }

        if (sourceList && destList) {
            if (sourceList.id === destList.id) {
                // Same list reordering
                const oldIndex = sourceList.cards.findIndex(c => c.id === activeCardId);
                const newIndex = sourceList.cards.findIndex(c => c.id === overIdParsed) !== -1
                    ? sourceList.cards.findIndex(c => c.id === overIdParsed)
                    : sourceList.cards.length;

                let actualNewIndex = newIndex;
                if (over.data.current?.type === "List") {
                    actualNewIndex = sourceList.cards.length;
                    // When dropping on container, usually goes to end. 
                    // ArrayMove handles index out of bounds? No, need valid index.
                    // But if dropped on list, effectively we want to move to end.
                    // If moving down, length-1. If moving up... wait.
                    // If we drop on the list container, we clearly want it at the end?
                    // Or maybe we treat empty list specially.
                    actualNewIndex = sourceList.cards.length;
                }

                // Correct newIndex for arrayMove if valid
                if (actualNewIndex > sourceList.cards.length - 1) actualNewIndex = sourceList.cards.length - 1;
                if (actualNewIndex < 0) actualNewIndex = 0;

                const newCards = arrayMove(sourceList.cards, oldIndex, actualNewIndex);

                const newLists = lists.map(l => {
                    if (l.id === sourceList.id) {
                        return { ...l, cards: newCards };
                    }
                    return l;
                });
                setLists(newLists);
                api.cards.reorder(newCards.map(c => c.id)).catch(console.error);

            } else {
                // Moving to different list
                const newLists = lists.map(l => {
                    if (l.id === sourceList.id) {
                        return { ...l, cards: l.cards.filter(c => c.id !== activeCardId) };
                    }
                    if (l.id === destList.id) {
                        const movedCard = sourceList.cards.find(c => c.id === activeCardId);
                        return { ...l, cards: [...l.cards, { ...movedCard, list_id: destList.id }] };
                    }
                    return l;
                });
                setLists(newLists);

                try {
                    await api.cards.move(activeCardId, destList.id);
                } catch (err) {
                    console.error(err);
                    loadBoard(); // Revert on error
                }
            }
        }
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    return (
        <div className="h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 bg-noise">
            {/* Header */}
            <header className="border-b border-border/40 p-4 flex justify-between items-center bg-background/60 backdrop-blur-xl sticky top-0 z-50 px-6 sm:px-8 transition-all duration-300">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <span className="font-heading font-bold text-3xl tracking-tight text-primary transition-all">Manage</span>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Avatar className="h-9 w-9 cursor-pointer border border-border/50 hover:ring-2 hover:ring-primary/20 transition-all">
                                <AvatarImage src={user.picture} alt={user.name} />
                                <AvatarFallback className="bg-primary/10 text-primary font-medium">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-2 mr-4" align="end">
                            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b border-border/40 mb-1">
                                {user.name}
                                <div className="text-xs font-normal text-muted-foreground/70">{user.email}</div>
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                onClick={onLogout}
                            >
                                Log out
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>
            </header>

            {/* Board Area */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                measuring={{
                    droppable: {
                        strategy: MeasuringStrategy.Always,
                    },
                }}
            >
                <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 sm:p-8">
                    <SortableContext items={lists.map(l => formatListId(l.id))} strategy={horizontalListSortingStrategy}>
                        <div className="flex h-full gap-6">
                            {lists.map((list) => (
                                <List
                                    key={list.id}
                                    list={list}
                                    onAddCard={handleAddCard}
                                    onDeleteList={handleDeleteList}
                                    onUpdateList={handleUpdateList}
                                    onDeleteCard={handleDeleteCard}
                                    onUpdateCard={handleUpdateCard}
                                />
                            ))}

                            {/* Add List Button */}
                            <div className="w-80 shrink-0">
                                {isAddingList ? (
                                    <form onSubmit={handleCreateList} className="bg-card/40 backdrop-blur-xl border border-border/50 p-3 rounded-2xl shadow-lg animate-in fade-in zoom-in-95 duration-200">
                                        <Input
                                            autoFocus
                                            placeholder="List title..."
                                            value={newListTitle}
                                            onChange={(e) => setNewListTitle(e.target.value)}
                                            className="mb-2 bg-background/50 border-border/40 focus-visible:ring-primary/30"
                                        />
                                        <div className="flex gap-2">
                                            <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">Add List</Button>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddingList(false)} className="hover:bg-muted/50">Cancel</Button>
                                        </div>
                                    </form>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        className="w-full h-12 justify-start px-4 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 text-muted-foreground hover:text-foreground rounded-2xl transition-all duration-300"
                                        onClick={() => setIsAddingList(true)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Add another list
                                    </Button>
                                )}
                            </div>
                        </div>
                    </SortableContext>
                </div>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeList ? (
                        <List
                            list={activeList}
                            onAddCard={() => { }} // Dummy handlers for drag appearance
                            onDeleteList={() => { }}
                            onUpdateList={() => { }}
                            onDeleteCard={() => { }}
                            onUpdateCard={() => { }}
                            isOverlay
                        />
                    ) : activeCard ? (
                        <Card card={activeCard} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

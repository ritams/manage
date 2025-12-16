import { useState } from "react";
import {
    DndContext,
    closestCorners,
    DragOverlay,
    defaultDropAnimationSideEffects,
    MeasuringStrategy
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";

import List from "./List";
import Card from "./Card";
import BoardHeader from "./BoardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

import { useBoardData } from "../hooks/useBoardData";
import { useBoardDrag } from "../hooks/useBoardDrag";

export default function Board({ user, onLogout }) {
    const {
        lists,
        setLists, // Needed for drag hook updates
        createList,
        updateList,
        deleteList,
        reorderLists,
        createCard,
        updateCard,
        deleteCard,
        moveCard,
        reorderCards
    } = useBoardData();

    const {
        sensors,
        activeId,
        activeList,
        activeCard,
        handleDragStart,
        handleDragEnd,
        formatListId
    } = useBoardDrag(lists, setLists, reorderLists, moveCard, reorderCards);

    const [isAddingList, setIsAddingList] = useState(false);
    const [newListTitle, setNewListTitle] = useState("");

    const handleCreateList = async (e) => {
        e.preventDefault();
        if (!newListTitle.trim()) return;
        await createList(newListTitle);
        setNewListTitle("");
        setIsAddingList(false);
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
            <BoardHeader user={user} onLogout={onLogout} />

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
                                    onAddCard={createCard}
                                    onDeleteList={deleteList}
                                    onUpdateList={updateList}
                                    onDeleteCard={deleteCard}
                                    onUpdateCard={updateCard}
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
                            onAddCard={() => { }}
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

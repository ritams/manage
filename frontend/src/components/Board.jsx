import { useState } from "react";
import {
    DndContext,
    closestCorners,
    pointerWithin,
    rectIntersection,
    getFirstCollision,
    DragOverlay,
    defaultDropAnimationSideEffects,
    MeasuringStrategy
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";

import List from "./List";
import Card from "./Card";
import BoardHeader from "./BoardHeader";
import TagDock from "./TagDock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

import { useBoardData } from "../hooks/useBoardData";
import { useBoardDrag } from "../hooks/useBoardDrag";
import { useGesture } from "@use-gesture/react";

export default function Board({ user, onLogout }) {
    const {
        boards,
        activeBoard,
        switchBoard,
        createBoard,
        updateBoard,
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
        reorderCards,
        tags,
        addTagToCard,
        removeTagFromCard,
        createTag,
        deleteTag
    } = useBoardData();

    const [isZoomedOut, setIsZoomedOut] = useState(false);

    // Pinch Gesture Handler
    const bind = useGesture({
        onPinch: ({ direction: [d] }) => {
            if (d < 0 && !isZoomedOut) setIsZoomedOut(true); // Pinch In -> Zoom Out
            if (d > 0 && isZoomedOut) setIsZoomedOut(false); // Pinch Out -> Zoom In
        },
    }, {
        pinch: { scaleBounds: { min: 0.5, max: 2 }, rubberband: true },
    });

    const {
        sensors,
        activeList,
        activeCard,
        activeTag,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        formatListId
    } = useBoardDrag(lists, setLists, reorderLists, moveCard, reorderCards, addTagToCard);

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
        <div className="h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-80 h-80 bg-accent/20 rounded-full blur-[100px] -z-10 animate-pulse delay-700"></div>

            <BoardHeader
                user={user}
                onLogout={onLogout}
                boards={boards}
                activeBoard={activeBoard}
                onSwitchBoard={switchBoard}
                onCreateBoard={createBoard}
                onUpdateBoard={updateBoard}
                isZoomedOut={isZoomedOut}
                onToggleZoom={() => setIsZoomedOut(!isZoomedOut)}
            />

            <DndContext
                sensors={sensors}
                collisionDetection={(args) => {
                    // Strict collision for Tags (Pointer MUST be over the card)
                    if (args.active.data.current?.type === "Tag") {
                        return pointerWithin(args);
                    }
                    // For Cards/Lists, use closestCorners (better for sorting)
                    return closestCorners(args);
                }}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                measuring={{
                    droppable: {
                        strategy: MeasuringStrategy.Always,
                    },
                }}
            >
                <div
                    {...bind()}
                    className="flex-1 overflow-x-auto overflow-y-auto px-6 pt-6 pb-24 sm:px-10 sm:pt-10 sm:pb-28 touch-pan-x touch-pan-y"
                >
                    <SortableContext items={lists.map(l => formatListId(l.id))} strategy={horizontalListSortingStrategy}>
                        <div
                            className={`flex gap-4 sm:gap-8 items-start pb-24 snap-x snap-mandatory h-full transition-transform duration-300 origin-top-left ${isZoomedOut ? 'scale-70 w-[142%]' : 'scale-100 w-full'}`}
                        >
                            {lists.map((list) => (
                                <List
                                    key={list.id}
                                    list={list}
                                    onAddCard={createCard}
                                    onDeleteList={deleteList}
                                    onUpdateList={updateList}
                                    onDeleteCard={deleteCard}
                                    onUpdateCard={updateCard}
                                    onRemoveTag={removeTagFromCard}
                                />
                            ))}

                            {/* Add List Button */}
                            <div className="w-80 shrink-0">
                                {isAddingList ? (
                                    <form onSubmit={handleCreateList} className="bg-card/60 backdrop-blur-2xl border border-primary/20 p-4 rounded-[2rem] shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                                        <div className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3 px-1">New Collection</div>
                                        <Input
                                            autoFocus
                                            placeholder="Enter title..."
                                            value={newListTitle}
                                            onChange={(e) => setNewListTitle(e.target.value)}
                                            className="mb-4 bg-background/50 border-border/40 focus-visible:ring-primary/30 h-10 rounded-xl font-medium"
                                        />
                                        <div className="flex gap-2">
                                            <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-4 font-bold">Create List</Button>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddingList(false)} className="hover:bg-muted/50 rounded-xl px-4">Cancel</Button>
                                        </div>
                                    </form>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        className="w-full h-[60px] justify-start px-6 bg-primary/5 hover:bg-primary/10 border border-dashed border-primary/20 hover:border-primary/40 text-primary/60 hover:text-primary rounded-[1.5rem] transition-all duration-500 group overflow-hidden relative shadow-sm"
                                        onClick={() => setIsAddingList(true)}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                                            <Plus className="h-5 w-5" />
                                        </div>
                                        <span className="font-bold tracking-tight">Add another collection</span>
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
                    ) : activeTag ? (
                        <div
                            className="px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-in zoom-in-95"
                            style={{ backgroundColor: activeTag.color, color: '#fff' }}
                        >
                            {activeTag.name}
                        </div>
                    ) : null}
                </DragOverlay>
                <TagDock
                    tags={tags}
                    onCreateTag={createTag}
                    onDeleteTag={deleteTag}
                />
            </DndContext>
        </div>
    );
}

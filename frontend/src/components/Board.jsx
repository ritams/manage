import { useState } from "react";
import {
    DndContext,
    closestCorners,
    pointerWithin,
    DragOverlay,
    defaultDropAnimationSideEffects,
    MeasuringStrategy
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";

import List from "./List";
import Card from "./Card";
import BoardHeader from "./BoardHeader";
import TagDock from "./TagDock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Sparkles } from "lucide-react";

import { useBoardData } from "../hooks/useBoardData";
import { useBoardDrag } from "../hooks/useBoardDrag";
import { useGesture } from "@use-gesture/react";

// Floating orb component for background
const FloatingOrb = ({ className, delay = 0, duration = 20 }) => (
    <motion.div
        className={className}
        animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.05, 1]
        }}
        transition={{
            duration,
            repeat: Infinity,
            delay,
            ease: "easeInOut"
        }}
    />
);

export default function Board({ user, onLogout }) {
    const {
        boards,
        activeBoard,
        switchBoard,
        createBoard,
        updateBoard,
        deleteBoard,
        lists,
        setLists,
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
        setCardDueDate,
        createTag,
        deleteTag
    } = useBoardData();

    const [isZoomedOut, setIsZoomedOut] = useState(false);

    // Pinch Gesture Handler
    const bind = useGesture({
        onPinch: ({ direction: [d] }) => {
            if (d < 0 && !isZoomedOut) setIsZoomedOut(true);
            if (d > 0 && isZoomedOut) setIsZoomedOut(false);
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
        <motion.div
            className="h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Animated Background Decorations */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <FloatingOrb
                    className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] bg-gradient-to-br from-primary/15 to-primary/5 rounded-full blur-[100px]"
                    delay={0}
                    duration={25}
                />
                <FloatingOrb
                    className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[400px] h-[400px] bg-gradient-to-tr from-accent/15 to-primary/10 rounded-full blur-[100px]"
                    delay={3}
                    duration={30}
                />
                <FloatingOrb
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-[80px]"
                    delay={5}
                    duration={20}
                />
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
            </div>

            <BoardHeader
                user={user}
                onLogout={onLogout}
                boards={boards}
                activeBoard={activeBoard}
                onSwitchBoard={switchBoard}
                onCreateBoard={createBoard}
                onUpdateBoard={updateBoard}
                onDeleteBoard={deleteBoard}
                isZoomedOut={isZoomedOut}
                onToggleZoom={() => setIsZoomedOut(!isZoomedOut)}
            />

            <DndContext
                sensors={sensors}
                collisionDetection={(args) => {
                    if (args.active.data.current?.type === "Tag") {
                        return pointerWithin(args);
                    }
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
                <motion.div
                    {...bind()}
                    className="flex-1 overflow-x-auto overflow-y-auto px-4 sm:px-6 md:px-10 pt-4 sm:pt-6 pb-24 sm:pb-28 touch-pan-x touch-pan-y"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                >
                    <SortableContext items={lists.map(l => formatListId(l.id))} strategy={horizontalListSortingStrategy}>
                        <motion.div
                            className={`flex gap-4 sm:gap-6 md:gap-8 items-start min-h-full pb-32 snap-x snap-mandatory transition-transform duration-300 origin-top-left ${isZoomedOut ? 'scale-75 md:scale-70 w-[133%] md:w-[142%]' : 'scale-100 w-full'}`}
                            layout
                        >
                            <AnimatePresence mode="popLayout">
                                {lists.map((list, index) => (
                                    <motion.div
                                        key={list.id}
                                        initial={{ opacity: 0, scale: 0.9, x: -20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, x: 20 }}
                                        transition={{
                                            delay: index * 0.05,
                                            duration: 0.3,
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25
                                        }}
                                        layout
                                    >
                                        <List
                                            list={list}
                                            onAddCard={createCard}
                                            onDeleteList={deleteList}
                                            onUpdateList={updateList}
                                            onDeleteCard={deleteCard}
                                            onUpdateCard={updateCard}
                                            onRemoveTag={removeTagFromCard}
                                            onSetDueDate={setCardDueDate}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Add List Button */}
                            <motion.div
                                className="w-[85vw] sm:w-80 shrink-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: lists.length * 0.05 + 0.2 }}
                            >
                                <AnimatePresence mode="wait">
                                    {isAddingList ? (
                                        <motion.form
                                            key="form"
                                            onSubmit={handleCreateList}
                                            className="bg-card/60 backdrop-blur-2xl border border-primary/20 p-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl"
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3 px-1 flex items-center gap-2">
                                                <Sparkles className="w-3.5 h-3.5" />
                                                New Collection
                                            </div>
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
                                        </motion.form>
                                    ) : (
                                        <motion.div
                                            key="button"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <Button
                                                variant="ghost"
                                                className="w-full h-[60px] justify-start px-5 sm:px-6 bg-primary/5 hover:bg-primary/10 border border-dashed border-primary/20 hover:border-primary/40 text-primary/60 hover:text-primary rounded-[1.25rem] sm:rounded-[1.5rem] transition-all duration-500 group overflow-hidden relative shadow-sm"
                                                onClick={() => setIsAddingList(true)}
                                            >
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0"
                                                    initial={{ x: "-100%" }}
                                                    whileHover={{ x: "100%" }}
                                                    transition={{ duration: 0.8 }}
                                                />
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 group-hover:scale-110 group-hover:bg-primary/15 transition-all">
                                                    <Plus className="h-5 w-5" />
                                                </div>
                                                <span className="font-bold tracking-tight">Add another collection</span>
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    </SortableContext>
                </motion.div>

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
                        <motion.div
                            className="px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                            style={{ backgroundColor: activeTag.color, color: '#fff' }}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                        >
                            {activeTag.name}
                        </motion.div>
                    ) : null}
                </DragOverlay>

                <TagDock
                    tags={tags}
                    onCreateTag={createTag}
                    onDeleteTag={deleteTag}
                />
            </DndContext>
        </motion.div>
    );
}

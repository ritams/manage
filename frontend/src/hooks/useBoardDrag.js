import { useState } from "react";
import {
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

export function useBoardDrag(lists, setLists, reorderLists, moveCard, reorderCards) {
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

    // Helpers
    const formatListId = (id) => `list-${id}`;
    const parseId = (id) => {
        if (!id) return null;
        if (typeof id === 'number') return id;
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

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeIdStr = active.id;
        const overIdStr = over.id;

        if (activeIdStr === overIdStr) return;

        const isActiveList = active.data.current?.type === "List";
        if (isActiveList) return;

        const activeCardId = parseId(activeIdStr);
        const overIdParsed = parseId(overIdStr);

        setLists((prev) => {
            const activeCard = active.data.current.card;
            const sourceList = prev.find(l => l.cards.find(c => c.id === activeCardId));

            let destList = null;
            if (over.data.current?.type === "List") {
                destList = prev.find(l => l.id === overIdParsed);
            } else if (over.data.current?.type === "Card") {
                destList = prev.find(l => l.cards.find(c => c.id === overIdParsed));
            }

            if (!sourceList || !destList) return prev;

            if (sourceList.id !== destList.id) {
                // Cross-list move (Optimistic)
                let overIndex;
                if (over.data.current?.type === "Card") {
                    overIndex = destList.cards.findIndex(c => c.id === overIdParsed);
                } else {
                    // Over the List container -> append to end
                    overIndex = destList.cards.length;
                }

                return prev.map(l => {
                    if (l.id === sourceList.id) {
                        return { ...l, cards: l.cards.filter(c => c.id !== activeCardId) };
                    }
                    if (l.id === destList.id) {
                        const newCards = [...l.cards];
                        // If card isn't already in this list, add it
                        if (!newCards.find(c => c.id === activeCardId)) {
                            newCards.splice(overIndex, 0, { ...activeCard, list_id: destList.id });
                        }
                        return { ...l, cards: newCards };
                    }
                    return l;
                });
            } else {
                // Same-list reorder (Dynamic shifting)
                const oldIndex = sourceList.cards.findIndex(c => c.id === activeCardId);
                const newIndex = destList.cards.findIndex(c => c.id === overIdParsed);

                if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
                    const newCards = arrayMove(sourceList.cards, oldIndex, newIndex);
                    return prev.map(l => {
                        if (l.id === sourceList.id) return { ...l, cards: newCards };
                        return l;
                    });
                }
            }
            return prev;
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);
        setActiveList(null);
        setActiveCard(null);

        if (!over) return;

        const activeIdStr = active.id;
        const overIdStr = over.id;

        const isActiveList = active.data.current?.type === "List";

        if (isActiveList) {
            if (activeIdStr === overIdStr) return;
            const oldIndex = lists.findIndex((l) => formatListId(l.id) === activeIdStr);
            let overListIdStr = overIdStr;

            if (over.data.current?.type === "Card") {
                const overCardId = parseId(overIdStr);
                const overList = lists.find(l => l.cards.find(c => c.id === overCardId));
                if (overList) overListIdStr = formatListId(overList.id);
            }

            const newIndex = lists.findIndex((l) => formatListId(l.id) === overListIdStr);
            if (oldIndex !== -1 && newIndex !== -1) {
                const newLists = arrayMove(lists, oldIndex, newIndex);
                reorderLists(newLists);
            }
            return;
        }

        // Card Dragging Finish - Final Backend Sync
        const activeCardId = parseId(activeIdStr);
        const currentList = lists.find(l => l.cards.find(c => c.id === activeCardId));

        if (currentList) {
            // Check if it moved lists (activeCard stores INITIAL data)
            const cardIds = currentList.cards.map(c => c.id);
            if (activeCard.list_id !== currentList.id) {
                // MOVE then REORDER to ensure spot persistence
                moveCard(activeCardId, currentList.id, lists)
                    .then(() => reorderCards(lists, cardIds))
                    .catch(() => { /* error handled in useBoardData */ });
            } else {
                // Just same-list reorder
                reorderCards(lists, cardIds);
            }
        }
    };

    return {
        sensors,
        activeId,
        activeList,
        activeCard,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        formatListId
    };
}

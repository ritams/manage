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

    const handleDragEnd = (event) => {
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
            const oldIndex = lists.findIndex((l) => formatListId(l.id) === activeIdStr);
            let overListIdStr = overIdStr;

            if (over.data.current?.type === "Card") {
                const overCardId = parseId(overIdStr);
                const overList = lists.find(l => l.cards.find(c => c.id === overCardId));
                if (overList) {
                    overListIdStr = formatListId(overList.id);
                }
            }

            const newIndex = lists.findIndex((l) => formatListId(l.id) === overListIdStr);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newLists = arrayMove(lists, oldIndex, newIndex);
                reorderLists(newLists);
            }
            return;
        }

        // Card Dragging
        const activeCardId = parseId(activeIdStr);
        const overIdParsed = parseId(overIdStr);

        let sourceList = lists.find(l => l.cards.find(c => c.id === activeCardId));
        let destList = null;

        if (over.data.current?.type === "List") {
            destList = lists.find(l => l.id === overIdParsed);
        } else if (over.data.current?.type === "Card") {
            destList = lists.find(l => l.cards.find(c => c.id === overIdParsed));
        }

        if (sourceList && destList) {
            if (sourceList.id === destList.id) {
                // Same list
                const oldIndex = sourceList.cards.findIndex(c => c.id === activeCardId);
                const newIndex = sourceList.cards.findIndex(c => c.id === overIdParsed) !== -1
                    ? sourceList.cards.findIndex(c => c.id === overIdParsed)
                    : sourceList.cards.length;

                let actualNewIndex = newIndex;
                if (over.data.current?.type === "List") {
                    actualNewIndex = sourceList.cards.length;
                }

                if (actualNewIndex > sourceList.cards.length - 1) actualNewIndex = sourceList.cards.length - 1;
                if (actualNewIndex < 0) actualNewIndex = 0;

                const newCards = arrayMove(sourceList.cards, oldIndex, actualNewIndex);

                const newLists = lists.map(l => {
                    if (l.id === sourceList.id) return { ...l, cards: newCards };
                    return l;
                });

                reorderCards(newLists, newCards.map(c => c.id));
            } else {
                // Different list
                const movedCard = sourceList.cards.find(c => c.id === activeCardId);
                const newLists = lists.map(l => {
                    if (l.id === sourceList.id) {
                        return { ...l, cards: l.cards.filter(c => c.id !== activeCardId) };
                    }
                    if (l.id === destList.id) {
                        return { ...l, cards: [...l.cards, { ...movedCard, list_id: destList.id }] };
                    }
                    return l;
                });

                moveCard(activeCardId, destList.id, newLists);
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
        formatListId
    };
}

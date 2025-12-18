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

        const activeCard = active.data.current.card;
        const sourceList = lists.find(l => l.cards.find(c => c.id === activeCardId));

        let destList = null;
        if (over.data.current?.type === "List") {
            destList = lists.find(l => l.id === overIdParsed);
        } else if (over.data.current?.type === "Card") {
            destList = lists.find(l => l.cards.find(c => c.id === overIdParsed));
        }

        if (sourceList && destList && sourceList.id !== destList.id) {
            setLists((prev) => {
                const overIndex = over.data.current?.type === "Card"
                    ? destList.cards.findIndex(c => c.id === overIdParsed)
                    : destList.cards.length;

                return prev.map(l => {
                    if (l.id === sourceList.id) {
                        return { ...l, cards: l.cards.filter(c => c.id !== activeCardId) };
                    }
                    if (l.id === destList.id) {
                        const newCards = [...l.cards];
                        if (!newCards.find(c => c.id === activeCardId)) {
                            newCards.splice(overIndex, 0, { ...activeCard, list_id: destList.id });
                        }
                        return { ...l, cards: newCards };
                    }
                    return l;
                });
            });
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

        // Card Dragging - Sync with Backend
        const activeCardId = parseId(activeIdStr);
        const currentList = lists.find(l => l.cards.find(c => c.id === activeCardId));

        if (currentList) {
            // Find the original list to see if it moved
            // Actually, we can just always moveCard then reorderCards
            // But to be efficient, we check if list_id changed.
            // Since activeCard stores its INITIAL list_id, we compare.
            if (active.data.current.card.list_id !== currentList.id) {
                moveCard(activeCardId, currentList.id, lists).then(() => {
                    reorderCards(lists, currentList.cards.map(c => c.id));
                });
            } else {
                reorderCards(lists, currentList.cards.map(c => c.id));
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

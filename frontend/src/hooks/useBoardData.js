import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export function useBoardData() {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadBoard = async () => {
        try {
            const data = await api.board.get();
            setLists(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBoard();
    }, []);

    const createList = async (title) => {
        if (!title.trim()) return;
        // Optimistic update
        const tempId = Date.now();
        const newList = { id: tempId, title, position: lists.length, cards: [] };
        setLists([...lists, newList]);

        try {
            const { id } = await api.lists.create(title);
            // Replace tempId with real id
            setLists(prev => prev.map(l => l.id === tempId ? { ...l, id } : l));
        } catch (err) {
            console.error(err);
            loadBoard(); // Rollback on error
        }
    };

    const updateList = async (id, title) => {
        // Optimistic update
        setLists(prev => prev.map(l => l.id === id ? { ...l, title } : l));
        try {
            await api.lists.update(id, title);
        } catch (err) {
            console.error(err);
            loadBoard(); // Rollback
        }
    };

    const deleteList = async (id) => {
        // Optimistic update
        setLists(prev => prev.filter(l => l.id !== id));
        try {
            await api.lists.delete(id);
        } catch (err) {
            console.error(err);
            loadBoard(); // Rollback
        }
    };

    const reorderLists = async (newLists) => {
        setLists(newLists);
        try {
            await api.lists.reorder(newLists.map(l => l.id));
        } catch (err) {
            console.error("Failed to reorder lists:", err);
            loadBoard(); // Rollback if server fails
        }
    };

    const createCard = async (listId, text) => {
        if (!text.trim()) return;
        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const newCard = { id: tempId, list_id: listId, text, position: 999 };

        setLists(prev => prev.map(l => {
            if (l.id === listId) {
                return { ...l, cards: [...l.cards, newCard] };
            }
            return l;
        }));

        try {
            const { id } = await api.cards.create(listId, text);
            // Replace tempId with real id
            setLists(prev => prev.map(l => {
                if (l.id === listId) {
                    return { ...l, cards: l.cards.map(c => c.id === tempId ? { ...c, id } : c) };
                }
                return l;
            }));
        } catch (err) {
            console.error(err);
            loadBoard(); // Rollback
        }
    };

    const updateCard = async (id, text) => {
        // Optimistic update
        setLists(prev => prev.map(l => ({
            ...l,
            cards: l.cards.map(c => c.id === id ? { ...c, text } : c)
        })));

        try {
            await api.cards.update(id, text);
        } catch (err) {
            console.error(err);
            loadBoard(); // Rollback
        }
    };

    const deleteCard = async (id) => {
        // Optimistic update
        setLists(prev => prev.map(l => ({
            ...l,
            cards: l.cards.filter(c => c.id !== id)
        })));

        try {
            await api.cards.delete(id);
        } catch (err) {
            console.error(err);
            loadBoard(); // Rollback
        }
    };

    const moveCard = async (cardId, destListId, newLists) => {
        setLists(newLists);
        try {
            return await api.cards.move(cardId, destListId);
        } catch (err) {
            console.error("Failed to move card:", err);
            loadBoard(); // Rollback if server fails
            throw err;
        }
    };

    const reorderCards = async (newLists, newCardsIds) => {
        setLists(newLists);
        try {
            return await api.cards.reorder(newCardsIds);
        } catch (err) {
            console.error("Failed to reorder cards:", err);
            loadBoard(); // Rollback if server fails
            throw err;
        }
    };

    return {
        lists,
        setLists,
        loading,
        createList,
        updateList,
        deleteList,
        reorderLists,
        createCard,
        updateCard,
        deleteCard,
        moveCard,
        reorderCards
    };
}

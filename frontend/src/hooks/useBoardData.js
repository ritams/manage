import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { arrayMove } from "@dnd-kit/sortable";

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
        try {
            await api.lists.create(title);
            loadBoard();
        } catch (err) {
            console.error(err);
        }
    };

    const updateList = async (id, title) => {
        try {
            await api.lists.update(id, title);
            loadBoard();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteList = async (id) => {
        try {
            await api.lists.delete(id);
            loadBoard();
        } catch (err) {
            console.error(err);
        }
    };

    const reorderLists = async (newLists) => {
        setLists(newLists);
        try {
            await api.lists.reorder(newLists.map(l => l.id));
        } catch (err) {
            console.error(err);
        }
    };

    const createCard = async (listId, text) => {
        try {
            await api.cards.create(listId, text);
            loadBoard();
        } catch (err) {
            console.error(err);
        }
    };

    const updateCard = async (id, text) => {
        try {
            await api.cards.update(id, text);
            loadBoard();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteCard = async (id) => {
        try {
            await api.cards.delete(id);
            loadBoard();
        } catch (err) {
            console.error(err);
        }
    };

    const moveCard = async (cardId, destListId, newLists) => {
        setLists(newLists);
        try {
            await api.cards.move(cardId, destListId);
        } catch (err) {
            console.error(err);
            loadBoard();
        }
    };

    const reorderCards = async (newLists, newCardsIds) => {
        setLists(newLists);
        try {
            await api.cards.reorder(newCardsIds);
        } catch (err) {
            console.error(err);
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

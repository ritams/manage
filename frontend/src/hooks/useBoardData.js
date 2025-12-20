import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useSocket } from "@/context/SocketProvider";

export function useBoardData() {
    const [boards, setBoards] = useState([]);
    const [activeBoard, setActiveBoard] = useState(null);
    const [lists, setLists] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();

    // Initial load: Fetch boards and tags
    useEffect(() => {
        const init = async () => {
            try {
                const [boardsData, tagsData] = await Promise.all([
                    api.boards.get(),
                    api.tags.get()
                ]);
                setBoards(boardsData);
                setTags(tagsData);

                // Determine active board
                if (boardsData.length > 0) {
                    const savedBoardId = localStorage.getItem("lastBoardId");
                    const foundBoard = boardsData.find(b => b.id.toString() === savedBoardId);
                    const boardToLoad = foundBoard || boardsData[0];
                    setActiveBoard(boardToLoad);
                    // Fetch lists for this board
                    const listsData = await api.lists.get(boardToLoad.id);
                    setLists(listsData);
                    localStorage.setItem("lastBoardId", boardToLoad.id);
                } else {
                    // Should theoretically not happen if migration works, but handle empty
                    setLists([]);
                }
            } catch (err) {
                console.error("Failed to initialize board data:", err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // Socket integration
    useEffect(() => {
        if (!socket || !activeBoard) return;

        socket.emit('JOIN_BOARD', activeBoard.id);

        const handleUpdate = async () => {
            console.log("Received BOARD_UPDATED, refreshing lists...");
            const data = await api.lists.get(activeBoard.id);
            setLists(data);
        };

        socket.on('BOARD_UPDATED', handleUpdate);

        return () => {
            socket.emit('LEAVE_BOARD', activeBoard.id);
            socket.off('BOARD_UPDATED', handleUpdate);
        };
    }, [socket, activeBoard?.id]);

    // Switch board function
    const switchBoard = async (boardId) => {
        const board = boards.find(b => b.id === boardId);
        if (!board) return;

        setActiveBoard(board);
        setLoading(true);
        try {
            const listsData = await api.lists.get(board.id);
            setLists(listsData);
            localStorage.setItem("lastBoardId", board.id);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createBoard = async (name) => {
        console.log("[useBoardData] createBoard called with:", name);
        try {
            const newBoard = await api.boards.create(name);
            console.log("[useBoardData] API create returned:", newBoard);
            setBoards(prev => [...prev, newBoard]);

            // Critical Fix: Directly set active board because 'boards' state is stale here
            console.log("[useBoardData] Setting active board to:", newBoard);
            setActiveBoard(newBoard);
            setLists([]); // New board has no lists
            localStorage.setItem("lastBoardId", newBoard.id);

            return newBoard;
        } catch (err) {
            console.error("[useBoardData] createBoard failed:", err);
        }
    };

    const updateBoard = async (id, name) => {
        console.log("[useBoardData] updateBoard called for ID:", id, "Name:", name);
        console.log("[useBoardData] Current activeBoard:", activeBoard);

        try {
            await api.boards.update(id, name);
            console.log("[useBoardData] API update verified");

            setBoards(prev => prev.map(b => b.id == id ? { ...b, name } : b));

            // Relaxed check to handle string vs number ID mismatch
            if (activeBoard && activeBoard.id == id) {
                console.log("[useBoardData] Updating activeBoard state locally");
                setActiveBoard(prev => ({ ...prev, name }));
            } else {
                console.log("[useBoardData] activeBoard ID mismatch or null. Active:", activeBoard?.id, "Target:", id);
            }
        } catch (err) {
            console.error("[useBoardData] updateBoard error:", err);
        }
    };


    const createList = async (title) => {
        if (!title.trim() || !activeBoard) return;
        // Optimistic update
        const tempId = Date.now();
        const newList = { id: tempId, board_id: activeBoard.id, title, position: lists.length, cards: [] };
        setLists([...lists, newList]);

        try {
            const { id } = await api.lists.create(activeBoard.id, title);
            // Replace tempId with real id
            setLists(prev => prev.map(l => l.id === tempId ? { ...l, id } : l));
        } catch (err) {
            console.error(err);
            // Reload current board to be safe
            const data = await api.lists.get(activeBoard.id);
            setLists(data);
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
            // Reload current board
            if (activeBoard) {
                const data = await api.lists.get(activeBoard.id);
                setLists(data);
            }
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

    const addTagToCard = async (cardId, tagId) => {
        // Optimistic update
        setLists(prev => prev.map(l => ({
            ...l,
            cards: l.cards.map(c => {
                if (c.id === cardId) {
                    const tag = tags.find(t => t.id === tagId);
                    if (tag && !c.tags.some(t => t.id === tagId)) {
                        return { ...c, tags: [...c.tags, tag] };
                    }
                }
                return c;
            })
        })));

        try {
            await api.cards.addTag(cardId, tagId);
        } catch (err) {
            console.error(err);
            loadBoard();
        }
    };

    const removeTagFromCard = async (cardId, tagId) => {
        // Optimistic update
        setLists(prev => prev.map(l => ({
            ...l,
            cards: l.cards.map(c => {
                if (c.id === cardId) {
                    return { ...c, tags: c.tags.filter(t => t.id !== tagId) };
                }
                return c;
            })
        })));

        try {
            await api.cards.removeTag(cardId, tagId);
        } catch (err) {
            console.error(err);
            loadBoard();
        }
    };

    const createTag = async (name, color) => {
        try {
            const newTag = await api.tags.create(name, color);
            setTags(prev => [...prev, newTag]);
            return newTag;
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTag = async (id) => {
        setTags(prev => prev.filter(t => t.id !== id));
        try {
            await api.tags.delete(id);
            // Also update lists to remove this tag from cards
            setLists(prev => prev.map(l => ({
                ...l,
                cards: l.cards.map(c => ({
                    ...c,
                    tags: c.tags.filter(t => t.id !== id)
                }))
            })));
        } catch (err) {
            console.error(err);
            loadBoard();
        }
    };

    return {
        boards,
        activeBoard,
        switchBoard,
        createBoard,
        updateBoard,
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
        reorderCards,
        tags,
        addTagToCard,
        removeTagFromCard,
        createTag,
        deleteTag
    };
}

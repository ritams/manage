const API_URL = window.location.hostname === 'localhost' ? "http://localhost:3000" : "/api";

const fetchWithAuth = async (url, options = {}) => {
    options.credentials = "include";
    options.headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${url}`, options);
    if (!response.ok) {
        const text = await response.text();
        console.error(`API Error ${url}:`, text);
        throw new Error(text);
    }
    return response.json();
};

export const api = {
    auth: {
        google: (token) => fetchWithAuth("/auth/google", { method: "POST", body: JSON.stringify({ token }) }),
        me: () => fetchWithAuth("/auth/me"),
        logout: () => fetchWithAuth("/auth/logout", { method: "POST" }),
    },
    board: {
        get: () => fetchWithAuth("/board"),
    },
    lists: {
        create: (title) => fetchWithAuth("/lists", { method: "POST", body: JSON.stringify({ title }) }),
        delete: (id) => fetchWithAuth(`/lists/${id}`, { method: "DELETE" }),
        update: (id, title) => fetchWithAuth(`/lists/${id}`, { method: "PUT", body: JSON.stringify({ title }) }),
        reorder: (listIds) => fetchWithAuth("/lists/reorder", { method: "PUT", body: JSON.stringify({ listIds }) }),
    },
    cards: {
        create: (listId, text) => fetchWithAuth("/cards", { method: "POST", body: JSON.stringify({ listId, text }) }),
        delete: (id) => fetchWithAuth(`/cards/${id}`, { method: "DELETE" }),
        update: (id, text) => fetchWithAuth(`/cards/${id}`, { method: "PUT", body: JSON.stringify({ text }) }),
        reorder: (cardIds) => fetchWithAuth("/cards/reorder", { method: "PUT", body: JSON.stringify({ cardIds }) }),
        move: (cardId, listId) => fetchWithAuth("/cards/move", { method: "POST", body: JSON.stringify({ cardId, listId }) }),
        addTag: (cardId, tagId) => fetchWithAuth("/cards/tags", { method: "POST", body: JSON.stringify({ cardId, tagId }) }),
        removeTag: (cardId, tagId) => fetchWithAuth(`/cards/${cardId}/tags/${tagId}`, { method: "DELETE" }),
    },
    tags: {
        get: () => fetchWithAuth("/tags"),
        create: (name, color) => fetchWithAuth("/tags", { method: "POST", body: JSON.stringify({ name, color }) }),
        update: (id, name, color) => fetchWithAuth(`/tags/${id}`, { method: "PUT", body: JSON.stringify({ name, color }) }),
        delete: (id) => fetchWithAuth(`/tags/${id}`, { method: "DELETE" }),
    },
};

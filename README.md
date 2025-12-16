# Manage - Kanban Board

A deeply integrated Kanban task manager built with React, Node.js, and SQLite.

## Features

-   **Drag & Drop**: Smooth dragging of cards and lists (powered by `@dnd-kit/core`).
-   **Persistence**: Data persists via SQLite backend. List and card order is saved.
-   **Authentication**: Google OAuth integration using JWT for sessions.
-   **Theme**: Dark/Light mode toggle with persistence.
-   **Optimistic UI**: Instant feedback on interactions before server confirmation.

## Project Structure

-   `/backend`: Node.js + Express server with SQLite database.
-   `/frontend`: React + Vite application.

## Getting Started

### Prerequisites

-   Node.js (v18+)
-   Google Cloud Console Project (for OAuth Client ID)

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root (parent of backend/frontend) or in `backend/` with:
    ```env
    VITE_GOOGLE_CLIENT_ID=your_client_id
    JWT_SECRET=your_jwt_secret
    ```
4.  Start the server:
    ```bash
    node server.js
    ```
    Currently running on `http://localhost:3000`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    Usually running on `http://localhost:5173`.

## Deployment

Ensure both backend and frontend build processes are handled if deploying to production.

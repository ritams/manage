import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "https://manage.ritampal.com"],
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("JOIN_BOARD", (boardId) => {
            if (boardId) {
                socket.join(`board_${boardId}`);
                console.log(`Socket ${socket.id} joined board_${boardId}`);
            }
        });

        socket.on("LEAVE_BOARD", (boardId) => {
            if (boardId) {
                socket.leave(`board_${boardId}`);
                console.log(`Socket ${socket.id} left board_${boardId}`);
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

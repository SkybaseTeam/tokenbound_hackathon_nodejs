import { Server, Socket } from "socket.io";

export const connectWithSocket = (io: Server) => {
   const connectedClients = new Map<string, Socket>();

    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.on("disconnect", () => {
            console.log("User disconnected");
            // Remove client when disconnected
            connectedClients.delete(socket.id);
        });

        // Listen for the "user-connected" event with a userId
        socket.on("user-connected", (userId: string) => {
            console.log(`User connected with ID: ${userId}`);
            // Store the socket connection with the user ID
            connectedClients.set(userId, socket);
        });

        // Send a message to a specific user
        socket.on("send-message", ({ userId, message }) => {
            console.log(`Sending message to user ID: ${userId}`);
            const userSocket = connectedClients.get(userId);
            if (userSocket) {
                userSocket.emit("message", message); // Emit the message to the user
            } else {
                console.log(`User ID ${userId} is not connected`);
            }
        });
    });
};

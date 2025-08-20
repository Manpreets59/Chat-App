import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] = [];

wss.on("connection", function (socket) {
  console.log("New client connected");

  socket.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message.toString());
      
      if (parsedMessage.type === "join") {
        // Remove existing socket if it exists (in case of reconnection)
        allSockets = allSockets.filter(user => user.socket !== socket);
        
        // Add new user
        allSockets.push({
          socket,
          room: parsedMessage.payload.roomId,
        });
        
        console.log(`User joined room: ${parsedMessage.payload.roomId}`);
      }

      if (parsedMessage.type === "chat") {
        let currentUserRoom = null;
        
        // Find current user's room
        for (let i = 0; i < allSockets.length; i++) {
          if (allSockets[i]?.socket === socket) {
            currentUserRoom = allSockets[i]?.room;
            break;
          }
        }

        if (!currentUserRoom) {
          console.log("User not in any room");
          return;
        }

        console.log(`Broadcasting message to room: ${currentUserRoom}`);
        
        // Send message to all users in the same room
        for (let i = 0; i < allSockets.length; i++) {
          if (allSockets[i]?.room === currentUserRoom) {
            // Send the actual message, not the roomId
            allSockets[i]?.socket.send(parsedMessage.payload.message);
          }
        }
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  socket.on("close", () => {
    // Remove user from allSockets when they disconnect
    allSockets = allSockets.filter(user => user.socket !== socket);
    console.log("Client disconnected");
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

console.log("WebSocket server running on port 8080");
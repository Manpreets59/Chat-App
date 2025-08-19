import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let userCount = 0;
let allSockets: WebSocket[] = [];

wss.on("connection", function (socket) {
  allSockets.push(socket);
  userCount += 1;
  console.log("user connnected #" + userCount);

  socket.on("message", (message) => {
    console.log("message received: ", message.toString());

    for (const s of allSockets) {
      if (s !== socket) {
        s.send(message.toString() + ": sent from the server");
      }
    }
  });
});

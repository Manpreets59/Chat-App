import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080});

wss.on("connection", function(socket){
    console.log("user connnected")

    socket.on("message", (e) => {
        console.log("message received", e.toString());
        console.log(e.toString() === "ping");

        if(e.toString() === "ping"){
            socket.send("pong");
        }
    })
})

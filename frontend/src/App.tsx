import { useEffect, useRef, useState } from "react";

import "./App.css";

function App() {
  const [messages, setMessages] = useState(["hi there", "this is here"]);
  const wsRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };
  }, []);

  return (
    <div className="h-screen bg-black ">
      <br /> <br /> <br /> <br />
      <div className="h-[95vh]">
        {messages.map((message) => (
          <div className="m-8">
            <span className="bg-white text-black rounded p-4 ">
              {message}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-white flex p-4">
        <input type="text" id="message" className="flex1 border border-black rounded-sm" />
        <button
          onClick={() => {
            const message = document.getElementById("message")?.value;
            wsRef.current.send(
              JSON.stringify({
                type: "chat",
                payload: {
                  message: message,
                },
              })
            );
          }}
          className="bg-purple-600 text-white rounded-sm"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

export default App;

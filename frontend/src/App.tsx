import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState(["hi there", "this is here"]);
  const [inputMessage, setInputMessage] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

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

    // Cleanup function to close WebSocket when component unmounts
    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (wsRef.current && inputMessage.trim()) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: inputMessage,
          },
        })
      );
      setInputMessage(""); // Clear input after sending
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="h-screen bg-black">
      <br /> <br /> <br /> <br />
      <div className="h-[95vh]">
        {messages.map((message, index) => (
          <div key={index} className="m-8">
            <span className="bg-white text-black rounded p-4">
              {message}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-white flex p-4">
        <input 
          type="text" 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border border-black rounded-sm p-2 mr-2" 
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white rounded-sm px-4 py-2"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

export default App;
import { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setmessages] = useState<string[]>(["hi there"]);
  const [input, setInput] = useState("");

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      setmessages(prevMesages => [...prevMesages, event.data]);
    };

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "123"
        }
      }));
    };

    // ✅ CLEANUP ADDED (IMPORTANT)
    return () => {
      ws.close();
    };
  }, []);

 return (
  <div className="h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center">

    {/* Glow Background Effect */}
    <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full top-10 left-10"></div>
    <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full bottom-10 right-10"></div>

    {/* Main Chat App */}
    <div className="relative w-[95%] max-w-3xl h-[92vh] rounded-3xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden">

      {/* Header */}
      <div className="h-[75px] flex items-center justify-between px-6 border-b border-white/10 bg-gradient-to-r from-zinc-900 to-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold">
            C
          </div>
          <div>
            <h1 className="text-white text-lg font-semibold tracking-wide">
              ChatRoom
            </h1>
            <div className="text-xs text-green-400">● Online</div>
          </div>
        </div>

        <div className="text-xs text-zinc-400">
          Secure • Realtime
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">

        {messages.map((msg, index) => (
          <div
            key={index}
            className="group max-w-[78%] px-5 py-3 text-sm text-white rounded-2xl
            bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900
            border border-white/10 shadow-lg
            hover:scale-[1.02] transition-all duration-200"
          >
            <div className="text-xs text-zinc-400 mb-1">user</div>
            {msg}
          </div>
        ))}

      </div>

      {/* Input Area */}
      <div className="h-[95px] px-5 flex items-center gap-4 border-t border-white/10 bg-zinc-950">

        <div className="relative flex-1">
          <input
            value={input}
            type="text"
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-[52px] bg-zinc-900 border border-white/10 rounded-xl px-5 text-white outline-none
            placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />

          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">
            Enter ↵
          </div>
        </div>

        <button
          onClick={() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                type: "chat",
                payload: { message: input }
              }));
            }
            setInput("");
          }}
          className="h-[52px] px-8 rounded-xl text-white font-semibold tracking-wide
          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
          shadow-[0_10px_30px_rgba(99,102,241,0.5)]
          hover:shadow-[0_10px_40px_rgba(236,72,153,0.6)]
          hover:brightness-110 active:scale-95 transition-all"
        >
          Send
        </button>
      </div>

    </div>
  </div>
);

  
}

export default App;

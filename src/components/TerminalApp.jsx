import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

export default function TerminalApp({ level, onSubmit, onSkip, credits }) {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState(["> CONNECTED TO SECURE SHELL"]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Puzzle Logic
  useEffect(() => {
    if (level && level.type === "console") {
      window.isAdmin = () => false;
      window.checkAccess = () => {
        if (window.isAdmin()) {
          alert(`ACCESS GRANTED. FLAG: PHX204`);
        } else {
          console.error("Access Denied.");
          alert("Access Denied. Check Console.");
        }
      };
    }
  }, [level]);

  const handleCommand = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input.trim();
    setLogs((prev) => [...prev, `> ${cmd}`]);

    if (cmd === "clear") {
      setLogs([]);
      setInput("");
      return;
    }
    if (cmd === "help") {
      setLogs((prev) => [...prev, "Cmds: submit <flag>, skip, clear"]);
      setInput("");
      return;
    }
    if (cmd === "skip") {
      const res = onSkip();
      setLogs((prev) => [...prev, res.msg]);
      setInput("");
      return;
    }
    const cleanCmd = cmd.startsWith("submit ")
      ? cmd.replace("submit ", "")
      : cmd;
    const res = await onSubmit(cleanCmd);
    setLogs((prev) => [
      ...prev,
      res.success ? `[SUCCESS] ${res.msg}` : `[ERROR] ${res.msg}`,
    ]);
    setInput("");
  };

  if (!level)
    return (
      <div className="p-10 text-green-500 text-center h-full flex items-center justify-center">
        ALL LEVELS COMPLETE.
        <br />
        MISSION ACCOMPLISHED.
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-black text-green-500 font-mono text-sm pt-8">
      {" "}
      {/* Added pt-8 for status bar */}
      <div className="bg-green-900/10 p-3 text-xs flex justify-between border-b border-green-900/50">
        <span className="text-green-300">USER: ADMIN</span>
        <span className="text-green-300">CREDITS: ${credits}</span>
      </div>
      <div className="p-4 border-b border-green-900/30 bg-green-900/5 text-gray-400 text-xs">
        <div className="flex justify-between mb-2">
          <span className="text-green-500 font-bold uppercase">
            Target: {level.title}
          </span>
          <span className="text-green-800">ID: #{level.id}</span>
        </div>
        <p className="mb-3 leading-relaxed">{level.prompt}</p>

        {/* Puzzle Visuals */}
        {level.type === "visual" && (
          <div className="bg-white p-3 text-center select-text mt-2 text-black font-bold rounded">
            <span className="text-white select-all">PHX101</span>
          </div>
        )}
        {level.type === "html_comment" && (
          <div
            className="text-gray-700 text-center border border-gray-800 p-2 mt-2 select-none font-bold"
            dangerouslySetInnerHTML={{
              __html: "<!-- DEBUG_KEY: PHX102 --> Inspect Element.",
            }}
          ></div>
        )}
        {level.type === "console" && (
          <button
            onClick={() => window.checkAccess && window.checkAccess()}
            className="w-full border border-red-500 text-red-500 p-2 mt-2 hover:bg-red-900/20 rounded uppercase font-bold tracking-widest"
          >
            Execute Login()
          </button>
        )}
        {level.type === "encoding" && (
          <div className="bg-neutral-900 p-3 break-all text-purple-400 border border-purple-900 mt-2 font-mono rounded">
            {level.content}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-20">
        {logs.map((l, i) => (
          <div
            key={i}
            className={
              l.includes("[ERROR]")
                ? "text-red-500"
                : l.includes("[SUCCESS]")
                  ? "text-green-400 font-bold"
                  : "text-green-700"
            }
          >
            {l}
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>
      {/* FIXED INPUT BAR */}
      <form
        onSubmit={handleCommand}
        className="absolute bottom-0 left-0 right-0 p-2 border-t border-green-900/50 bg-neutral-900 flex gap-2 items-center"
      >
        <span className="mt-0 text-green-500">$</span>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-green-400 placeholder-green-900/50 h-10"
          placeholder="Enter command..."
        />
        <button
          type="submit"
          className="p-2 bg-green-900/20 text-green-500 rounded hover:bg-green-500 hover:text-black transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

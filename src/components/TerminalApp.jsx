import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import DecryptedText from "./ui/DecryptedText";

export default function TerminalApp({
  level,
  onSubmit,
  onSkip,
  credits,
  playSound,
}) {
  const [input, setInput] = useState("");
  // Logs are now objects: { id, type, content }
  const [logs, setLogs] = useState([
    { id: 1, type: "text", content: "> CONNECTED TO SECURE SHELL" },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Puzzle Logic for Level 3
  useEffect(() => {
    if (level && level.type === "console") {
      window.isAdmin = () => false;
      window.checkAccess = () => {
        if (window.isAdmin()) {
          alert(`ACCESS GRANTED. FLAG: ROOT_ACCESS_GRANTED`);
        } else {
          console.error("Access Denied.");
          alert("Access Denied. Check Console.");
        }
      };
    }
  }, [level]);

  const addLog = (content, type = "text") => {
    setLogs((prev) => [...prev, { id: Date.now(), type, content }]);
  };

  const handleCommand = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input.trim();

    // Log user input
    addLog(`> ${cmd}`, "command");

    if (cmd === "clear") {
      setLogs([]);
      setInput("");
      return;
    }
    if (cmd === "help") {
      addLog("Cmds: submit <flag>, skip, clear", "info");
      setInput("");
      return;
    }
    if (cmd === "skip") {
      const res = onSkip();
      addLog(res.msg, res.success ? "info" : "error");
      setInput("");
      return;
    }

    const cleanCmd = cmd.startsWith("submit ")
      ? cmd.replace("submit ", "")
      : cmd;

    const res = await onSubmit(cleanCmd);

    if (res.success) {
      if (playSound) playSound("success");
      addLog(res.msg, "success_component");
    } else {
      if (playSound) playSound("error");
      addLog(`[ERROR] ${res.msg}`, "error");
    }

    setInput("");
  };

  if (!level)
    return (
      <div className="p-10 text-green-500 text-center h-full flex items-center justify-center font-bold animate-pulse">
        ALL LEVELS COMPLETE.
        <br />
        MISSION ACCOMPLISHED.
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-black text-green-500 font-mono text-sm pt-8">
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
          <div className="bg-white p-3 text-center select-text mt-2 text-black font-bold rounded cursor-text">
            {/* White text on white background */}
            <span className="text-white select-all">CYPHX2x1</span>
          </div>
        )}
        {level.type === "html_comment" && (
          <div
            data-secret="DEV_BACKDOOR_X7"
            className="text-gray-700 text-center border border-gray-800 p-2 mt-2 select-none font-bold cursor-help"
            title="Right Click > Inspect"
          >
            Inspect Element.
          </div>
        )}
        {level.type === "console" && (
          <button
            onClick={() => window.checkAccess && window.checkAccess()}
            className="w-full border border-red-500 text-red-500 p-2 mt-2 hover:bg-red-900/20 rounded uppercase font-bold tracking-widest transition-colors"
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
        {logs.map((l) => (
          <div
            key={l.id}
            className={
              l.type === "error"
                ? "text-red-500"
                : l.type === "info"
                  ? "text-blue-400"
                  : "text-green-500"
            }
          >
            {l.type === "success_component" ? (
              <DecryptedText
                text={`[SUCCESS] ${l.content}`}
                className="font-bold text-green-400"
              />
            ) : (
              l.content
            )}
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>

      {/* INPUT BAR */}
      <form
        onSubmit={handleCommand}
        className="absolute bottom-0 left-0 right-0 p-2 border-t border-green-900/50 bg-neutral-900 flex gap-2 items-center"
      >
        <span className="mt-0 text-green-500">$</span>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparentVx outline-none text-green-400 placeholder-green-900/50 h-10 border-none focus:ring-0"
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

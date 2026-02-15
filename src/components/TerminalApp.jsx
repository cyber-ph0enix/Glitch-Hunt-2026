import React, { useState, useEffect, useRef } from "react";
import { Send, TerminalSquare } from "lucide-react";
import DecryptedText from "./ui/DecryptedText";

export default function TerminalApp({
  level,
  onSubmit,
  onSkip,
  credits,
  playSound,
}) {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState([
    { id: 1, type: "system", content: "Ph0enixOS Shell v4.0.2" },
  ]);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Keep focus on input when clicking terminal background
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addLog = (content, type = "text") => {
    setLogs((prev) => [...prev, { id: Date.now(), type, content }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input.trim();

    // Log User Command
    addLog(cmd, "command");

    // Process Local Commands
    if (cmd === "clear") {
      setLogs([]);
      setInput("");
      return;
    }
    if (cmd === "help") {
      addLog("AVAILABLE COMMANDS:", "info");
      addLog("  submit <flag>  : Verify a puzzle solution", "text");
      addLog("  skip           : Skip current level (-250 credits)", "text");
      addLog("  clear          : Clear terminal output", "text");
      setInput("");
      return;
    }
    if (cmd === "skip") {
      const res = onSkip();
      addLog(res.msg, res.success ? "info" : "error");
      setInput("");
      return;
    }

    // Process Game Logic
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
      <div className="p-10 text-green-500 animate-pulse text-center">
        SYSTEM HALTED. ALL OBJECTIVES COMPLETE.
      </div>
    );

  return (
    <div
      className="flex flex-col h-full bg-[#050505] font-mono text-sm relative"
      onClick={() => inputRef.current?.focus()} // Click anywhere to focus
    >
      {/* HEADER INFO */}
      <div className="bg-[#111] p-3 border-b border-[#222] flex justify-between items-center text-xs select-none">
        <div className="flex items-center gap-2 text-gray-400">
          <TerminalSquare size={14} className="text-green-500" />
          <span>/bin/bash</span>
        </div>
        <div className="flex gap-4">
          <span className="text-green-400 font-bold">CREDITS: ${credits}</span>
          <span className="text-gray-500">USER: ADMIN</span>
        </div>
      </div>

      {/* PUZZLE PROMPT AREA */}
      <div className="bg-[#0a0a0a] border-b border-[#222] p-4 text-gray-300 text-xs">
        <div className="flex justify-between mb-2">
          <span className="text-green-500 font-bold uppercase tracking-wider">
            TARGET :: {level.title}
          </span>
          <span className="text-gray-600">ID: #{level.id}</span>
        </div>
        <p className="leading-relaxed opacity-90">{level.prompt}</p>

        {/* Level Specific Visuals */}
        {level.type === "visual" && (
          <div className="mt-3 p-3 bg-white text-white select-text cursor-text rounded font-bold text-center">
            PHX101
          </div>
        )}
        {level.type === "html_comment" && (
          <div
            data-secret="DEV_BACKDOOR_X7"
            className="mt-3 p-2 border border-dashed border-gray-700 text-gray-600 text-center text-xs hover:border-green-500/30 transition-colors cursor-help"
            title="Inspect Element?"
          >
            [ DOM NODE :: HIDDEN ATTRIBUTES ]
          </div>
        )}
        {level.type === "console" && (
          <button
            onClick={() => window.checkAccess && window.checkAccess()}
            className="mt-3 w-full border border-red-900/50 bg-red-900/10 text-red-500 py-2 text-xs font-bold hover:bg-red-900/20 transition-all"
          >
            ⚠ EXECUTE_LOGIN_ROUTINE()
          </button>
        )}
        {level.type === "encoding" && (
          <div className="mt-3 p-3 bg-[#111] border border-[#333] text-purple-400 font-mono break-all rounded">
            {level.content}
          </div>
        )}
      </div>

      {/* LOG OUTPUT AREA (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1.5 pb-20 custom-scrollbar">
        {logs.map((l) => (
          <div key={l.id} className="break-words">
            {l.type === "command" && (
              <span className="text-gray-500 mr-2">$ {l.content}</span>
            )}
            {l.type === "system" && (
              <span className="text-blue-400">{l.content}</span>
            )}
            {l.type === "text" && (
              <span className="text-gray-300">{l.content}</span>
            )}
            {l.type === "error" && (
              <span className="text-red-500">{l.content}</span>
            )}
            {l.type === "info" && (
              <span className="text-yellow-500">{l.content}</span>
            )}
            {l.type === "success_component" && (
              <DecryptedText
                text={`[SUCCESS] ${l.content}`}
                className="text-green-400 font-bold"
              />
            )}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* FIXED INPUT BAR */}
      <form
        onSubmit={handleSubmit}
        className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#222] p-2 flex items-center gap-2"
      >
        <span className="text-green-500 font-bold pl-2 animate-pulse">❯</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono placeholder-green-900/50 h-10"
          placeholder="Enter command..."
          autoComplete="off"
          autoFocus
        />
        <button
          type="submit"
          className="p-2 text-green-600 hover:text-green-400 transition-colors"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

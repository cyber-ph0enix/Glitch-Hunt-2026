import React from "react";
import { StickyNote } from "lucide-react";
import { RULEBOOK } from "../data/gameConfig";

// Simple Markdown Parser for **Bold**
const SimpleMarkdown = ({ text }) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="text-yellow-600 font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </span>
  );
};

export default function NotesApp() {
  return (
    <div className="flex flex-col h-full bg-[#fdf6e3] text-[#586e75] font-sans pt-8">
      <div className="p-4 border-b border-[#eee8d5] flex justify-between items-center bg-[#eee8d5]">
        <span className="font-bold text-[#b58900] flex items-center gap-2">
          <StickyNote size={16} /> Notes
        </span>
        <span className="text-xs text-[#93a1a1]">Read Only</span>
      </div>
      <div className="p-6 overflow-y-auto flex-1 font-mono text-xs leading-relaxed whitespace-pre-wrap">
        <SimpleMarkdown text={RULEBOOK} />
      </div>
    </div>
  );
}

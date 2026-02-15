import React from "react";

export default function MessagesApp({ messages }) {
  return (
    <div className="flex flex-col h-full bg-black text-white pt-8">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-neutral-900">
        <h2 className="font-bold text-lg">Messages</h2>
        <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold">
          {messages.length}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages
          .slice()
          .reverse()
          .map((m) => (
            <div
              key={m.id}
              className="flex flex-col animate-[slide-up_0.3s_ease-out]"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] font-bold">
                  ?
                </div>
                <span className="text-xs text-gray-400 font-bold">
                  {m.sender}
                </span>
                <span className="text-[10px] text-gray-600 ml-auto">
                  {m.timestamp}
                </span>
              </div>
              <div className="bg-neutral-900 border border-gray-800 p-3 rounded-2xl rounded-tl-none text-sm text-gray-300 shadow-sm">
                {m.text}
              </div>
            </div>
          ))}
        {messages.length === 0 && (
          <div className="text-center text-gray-700 mt-20">
            No encrypted signals detected.
          </div>
        )}
      </div>
    </div>
  );
}

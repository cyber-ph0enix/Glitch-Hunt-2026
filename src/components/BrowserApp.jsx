import React, { useState } from "react";
import { Globe, Lock, AlertTriangle } from "lucide-react";

export default function BrowserApp({ levelId }) {
  const [url, setUrl] = useState("https://cyberphoenix.internal/gateway");
  const [pageState, setPageState] = useState("home");

  const handleConnect = () => {
    if (levelId === 2) {
      console.log(
        "%c[NETWORK] GET /api/auth -> { status: 418, token: 'PHX103' }",
        "color: #ff0000; background: #000; font-size: 14px; padding: 4px;",
      );
      setPageState("error");
    } else {
      alert("Gateway Timeout. Network unreachable.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-300 font-sans pt-8">
      {/* URL BAR */}
      <div className="p-3 bg-[#2d2d2d] border-b border-[#444] flex gap-3 items-center shadow-md z-10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        </div>
        <div className="flex-1 bg-[#1a1a1a] border border-[#444] rounded-md px-3 py-1.5 text-xs text-gray-400 flex items-center gap-2">
          <Lock size={10} />
          {url}
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {pageState === "home" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#1e1e1e] to-[#111]">
            <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Globe size={40} className="text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              CyberPh0enix Intranet
            </h1>
            <button
              onClick={handleConnect}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all font-bold text-sm shadow-lg shadow-blue-900/20"
            >
              Connect
            </button>
          </div>
        )}

        {pageState === "error" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black font-mono animate-in zoom-in duration-300">
            <AlertTriangle size={48} className="text-red-500 mb-4" />
            <h1 className="text-4xl font-bold text-red-500 mb-2 glitch-text">
              ERROR 404
            </h1>
            <p className="text-sm text-gray-400 mb-8">
              SERVER CONNECTION REFUSED
            </p>
            <div className="border border-red-900/50 bg-red-900/10 p-4 rounded text-left w-full max-w-xs">
              <p className="text-[10px] text-red-400 mb-1">DEBUG LOG:</p>
              <code className="text-[10px] text-red-300 block">
                {" "}
                Connection rejected by host
              </code>
              <code className="text-[10px] text-red-300 block">
                {" "}
                ERR_STATUS_418
              </code>
              <code className="text-[10px] text-red-300 block">
                {" "}
                Check DevTools Network Tab
              </code>
            </div>
            <button
              onClick={() => setPageState("home")}
              className="mt-8 text-xs text-gray-600 underline hover:text-white"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

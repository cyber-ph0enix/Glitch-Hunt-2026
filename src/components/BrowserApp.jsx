import React, { useState } from "react";
import { Globe, Lock, AlertTriangle, WifiOff } from "lucide-react";

export default function BrowserApp({ levelId }) {
  const [url, setUrl] = useState("https://cyberphoenix.internal/gateway");
  const [pageState, setPageState] = useState("home");

  const handleConnect = () => {
    if (levelId === 2) {
      console.clear();
      console.log(
        "%c[NETWORK] POST /api/v1/auth/handshake",
        "color: #00ff00; font-weight: bold; font-size: 12px;",
      );
      console.log(
        "%cRESPONSE: { status: 418, flag: 'STATUS_418_TEAPOT', message: 'I am a teapot' }",
        "color: #ff0000; background: #220000; padding: 4px; font-weight: bold;",
      );

      setPageState("error");
    } else {
      alert("Gateway Timeout. Network unreachable.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#18181b] text-gray-300 font-sans pt-8">
      {/* URL BAR */}
      <div className="p-2 bg-[#27272a] border-b border-[#3f3f46] flex gap-2 items-center shadow-md z-10">
        <div className="flex gap-1.5 ml-2">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex-1 bg-[#09090b] border border-[#3f3f46] rounded px-3 py-1.5 text-[10px] text-gray-400 flex items-center gap-2 font-mono">
          <Lock size={8} className="text-green-500" />
          {url}
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {pageState === "home" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#18181b] to-black">
            <div className="w-24 h-24 bg-blue-900/20 rounded-full flex items-center justify-center mb-8 animate-pulse ring-1 ring-blue-500/30">
              <Globe size={48} className="text-blue-500" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2 tracking-wide">
              Secure Intranet Gateway
            </h1>
            <p className="text-xs text-gray-500 mb-8 max-w-[200px]">
              Authorized Personnel Only. All connections are monitored.
            </p>
            <button
              onClick={handleConnect}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-all text-xs font-bold tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              ESTABLISH CONNECTION
            </button>
          </div>
        )}

        {pageState === "error" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black font-mono animate-in zoom-in duration-200">
            <WifiOff size={48} className="text-red-600 mb-6 opacity-80" />
            <h1 className="text-5xl font-black text-red-600 mb-2 tracking-tighter">
              418
            </h1>
            <p className="text-sm text-red-400 mb-8 font-bold tracking-widest uppercase">
              Connection Refused
            </p>

            <div className="w-full max-w-[240px] bg-red-950/30 border border-red-900/50 p-4 rounded text-left">
              <p className="text-[9px] text-red-500 mb-2 border-b border-red-900/50 pb-1">
                DIAGNOSTIC LOG
              </p>
              <div className="space-y-1 font-mono text-[9px] leading-tight opacity-70">
                <code className="block text-red-300">
                  Err: PROTOCOL_MISMATCH
                </code>
                <code className="block text-red-300">Src: /api/v1/auth</code>
                <code className="block text-yellow-500 animate-pulse">
                  Warn: Check Console Logs (F12)
                </code>
              </div>
            </div>

            <button
              onClick={() => setPageState("home")}
              className="mt-8 text-[10px] text-gray-600 hover:text-white transition-colors uppercase tracking-widest"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

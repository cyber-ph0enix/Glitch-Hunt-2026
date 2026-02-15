import React, { useState, useEffect, useRef } from "react";
import { useGameEngine } from "./hooks/useGameEngine";
import { LEVELS, RULEBOOK } from "./data/gameConfig";
import { SYSTEM_INFO } from "./data/build.prop";
import {
  Terminal,
  MessageSquare,
  StickyNote,
  Globe,
  Settings,
  Wifi,
  Battery,
  Signal,
  User,
  Lock,
  X,
  ChevronLeft,
  Send,
  Home,
  Square,
  AlertTriangle,
  Minimize2,
  Maximize2,
} from "lucide-react";

// Base64 Beep Sound
const NOTIFICATION_SOUND =
  "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU";

export default function App() {
  const { user, currentLevelIndex, messages, login, submitFlag, skipLevel } =
    useGameEngine();
  const [activeApp, setActiveApp] = useState(null);
  const [booted, setBooted] = useState(false);
  const [time, setTime] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Audio & Haptics Helper
  const notify = () => {
    if (SYSTEM_INFO?.vibrationEnabled && navigator.vibrate)
      navigator.vibrate(200);
    if (SYSTEM_INFO?.soundEnabled) {
      try {
        new Audio(NOTIFICATION_SOUND).play().catch(() => {});
      } catch (e) {}
    }
  };

  // Trigger notification on new message
  useEffect(() => {
    if (messages.length > 0) notify();
  }, [messages.length]);

  // Time Sync
  useEffect(() => {
    const t = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);

  if (!booted) return <BootScreen onComplete={() => setBooted(true)} />;
  if (!user) return <LoginScreen onLogin={login} />;

  return (
    <div className="min-h-screen w-full bg-neutral-900 flex items-center justify-center font-mono select-none overflow-hidden p-2 md:p-4">
      {/* PHONE CONTAINER */}
      <div
        className={`
          relative transition-all duration-500 ease-in-out bg-black shadow-2xl overflow-hidden flex flex-col border-neutral-800
          ${
            isFullscreen
              ? "w-full h-full rounded-none border-0"
              : "h-[90dvh] w-auto aspect-[9/19.5] rounded-[2.5rem] border-[8px]"
          }
        `}
      >
        {/* CRT EFFECT OVERLAY (Add .scanline to your index.css if needed) */}
        <div className="scanline opacity-10 pointer-events-none absolute inset-0 z-50"></div>

        {/* STATUS BAR */}
        <div className="h-8 bg-black/90 text-white flex justify-between items-center px-5 text-[10px] z-50 shrink-0">
          <span className="font-bold tracking-widest">{time}</span>
          <div className="flex gap-2 items-center">
            <Signal size={10} className="text-green-500" />
            <Wifi size={10} className="text-green-500" />
            <Battery size={12} className="text-green-500" />
          </div>
        </div>

        {/* OS CONTENT LAYER */}
        <div className="flex-1 relative bg-[url('[https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop)')] bg-cover bg-center flex flex-col overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>

          {/* MAXIMIZE BUTTON (PC ONLY) */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="absolute top-2 left-2 z-20 text-white/20 hover:text-white transition-colors md:block hidden"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* BUILD INFO / WATERMARK */}
          <div className="relative z-10 pt-8 text-center text-white/40 pointer-events-none">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold">
              {SYSTEM_INFO.owner}
            </p>
            <p className="text-[8px] opacity-70">
              {SYSTEM_INFO.osName} {SYSTEM_INFO.version}
            </p>
          </div>

          {/* APP GRID */}
          <div className="relative z-10 mt-auto mb-4 px-4 grid grid-cols-4 gap-y-6 gap-x-2 pb-4">
            <AppIcon
              icon={Terminal}
              label="Terminal"
              color="bg-green-900/80 border border-green-500/30"
              onClick={() => setActiveApp("terminal")}
              notification={currentLevelIndex < LEVELS.length}
            />
            <AppIcon
              icon={MessageSquare}
              label="Messages"
              color="bg-blue-900/80 border border-blue-500/30"
              onClick={() => setActiveApp("messages")}
              notification={messages.length > 0}
            />
            <AppIcon
              icon={StickyNote}
              label="Notes"
              color="bg-yellow-900/80 border border-yellow-500/30"
              onClick={() => setActiveApp("notes")}
            />
            <AppIcon
              icon={Globe}
              label="Browser"
              color="bg-indigo-900/80 border border-indigo-500/30"
              onClick={() => setActiveApp("browser")}
            />
            <AppIcon
              icon={Settings}
              label="Settings"
              color="bg-gray-800/80 border border-gray-500/30"
              onClick={() => setActiveApp("settings")}
            />
          </div>

          {/* DOCK BACKGROUND BLUR */}
          <div className="absolute bottom-4 left-4 right-4 h-20 bg-white/5 backdrop-blur-md rounded-3xl mx-auto -z-0"></div>
        </div>

        {/* ACTIVE APP WINDOW (FULLSCREEN OVERLAY) */}
        {activeApp && (
          <div className="absolute inset-0 z-40 bg-black flex flex-col animate-in slide-in-from-bottom duration-200">
            <div className="flex-1 overflow-hidden relative bg-neutral-900">
              {activeApp === "terminal" && (
                <TerminalApp
                  level={LEVELS[currentLevelIndex]}
                  onSubmit={submitFlag}
                  onSkip={skipLevel}
                  credits={user.credits}
                />
              )}
              {activeApp === "messages" && <MessagesApp messages={messages} />}
              {activeApp === "notes" && <NotesApp />}
              {activeApp === "browser" && (
                <BrowserApp levelId={currentLevelIndex} />
              )}
              {activeApp === "settings" && <SettingsApp user={user} />}
            </div>
          </div>
        )}

        {/* SYSTEM NAVIGATION BAR */}
        <div className="h-12 bg-black flex justify-around items-center text-gray-400 z-50 shrink-0 border-t border-neutral-800">
          <button
            onClick={() => setActiveApp(null)}
            className="p-4 active:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setActiveApp(null)}
            className="p-4 active:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <Home size={20} />
          </button>
          <button
            onClick={() => setActiveApp(null)}
            className="p-4 active:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <Square size={16} fill="currentColor" className="opacity-50" />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- APP COMPONENTS ---

const BootScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-green-500 font-mono">
      <div className="animate-pulse mb-4 text-3xl font-bold tracking-widest uppercase">
        {SYSTEM_INFO.osName}
      </div>
      <div className="text-[10px] text-green-800 mb-8">
        {SYSTEM_INFO.buildId}
      </div>
      <div className="w-48 h-1 bg-gray-900 rounded overflow-hidden">
        <div className="h-full bg-green-600 animate-pulse w-full shadow-[0_0_10px_#00ff00]"></div>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin }) => {
  const [name, setName] = useState("");
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 font-mono">
      <div className="w-full max-w-sm bg-black border border-green-900/50 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,255,0,0.05)]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30 text-green-500">
            <User size={32} />
          </div>
          <h2 className="text-xl text-white font-bold tracking-wider">
            IDENTITY VERIFICATION
          </h2>
          <p className="text-xs text-gray-500 mt-2">Secure Gateway v5.0</p>
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-neutral-900 border border-green-900 text-green-400 p-4 mb-4 rounded-xl focus:outline-none focus:border-green-500 text-center placeholder-green-900"
          placeholder="ENTER CODENAME"
        />
        <button
          onClick={() => name && onLogin(name)}
          className="w-full bg-green-600 text-black p-4 rounded-xl hover:bg-green-500 font-bold transition-all active:scale-95 shadow-lg shadow-green-900/20"
        >
          CONNECT
        </button>
      </div>
    </div>
  );
};

const AppIcon = ({ icon: IconComp, label, color, onClick, notification }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 group w-full"
  >
    <div
      className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-95 transition-transform relative`}
    >
      <IconComp size={24} />
      {notification && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-pulse"></div>
      )}
    </div>
    <span className="text-[10px] text-gray-300 font-medium tracking-tight">
      {label}
    </span>
  </button>
);

const TerminalApp = ({ level, onSubmit, onSkip, credits }) => {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState(["> CONNECTED TO SECURE SHELL"]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

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
    <div className="flex flex-col h-full bg-black text-green-500 font-mono text-sm">
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

        {level.type === "visual" && (
          <div className="bg-white p-3 text-center select-text mt-2 text-black font-bold rounded">
            <span className="text-white select-all">WAKE_UP_NEO</span>
          </div>
        )}
        {level.type === "html_comment" && (
          <div
            className="text-gray-700 text-center border border-gray-800 p-2 mt-2 select-none font-bold"
            dangerouslySetInnerHTML={{
              __html:
                "<!-- DEBUG_KEY: DEV_BACKDOOR_X7 --> Inspect Element is your friend.",
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

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
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

      {/* INPUT BAR WITH SEND BUTTON */}
      <form
        onSubmit={handleCommand}
        className="p-2 border-t border-green-900/50 bg-neutral-900 flex gap-2 items-center"
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
};

const MessagesApp = ({ messages }) => (
  <div className="flex flex-col h-full bg-black text-white">
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
            className="flex flex-col animate-in slide-in-from-bottom duration-300"
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

const NotesApp = () => (
  <div className="flex flex-col h-full bg-[#1a1a1a] text-[#e0e0e0] font-sans">
    <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#222]">
      <span className="font-bold text-yellow-500 flex items-center gap-2">
        <StickyNote size={16} /> Notes
      </span>
      <span className="text-xs text-gray-500">Read Only</span>
    </div>
    <div className="p-6 overflow-y-auto flex-1 font-mono text-xs leading-relaxed opacity-80 whitespace-pre-wrap">
      {RULEBOOK}
    </div>
  </div>
);

const BrowserApp = ({ levelId }) => {
  const [url, setUrl] = useState(
    "[https://cyberphoenix.internal/gateway](https://cyberphoenix.internal/gateway)",
  );
  const [pageState, setPageState] = useState("home");

  const handleConnect = () => {
    if (levelId === 2) {
      console.log(
        "%c[NETWORK] GET /api/auth -> { status: 418, token: 'STATUS_418_TEAPOT' }",
        "color: #ff0000; background: #000; font-size: 14px; padding: 4px;",
      );
      setPageState("error");
    } else {
      alert("Gateway Timeout. Network unreachable.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-300 font-sans">
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
            <p className="text-xs text-gray-500 mb-8 max-w-[200px]">
              Secure Gateway Access Point v9.0. Authorized Personnel Only.
            </p>
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
                &gt; Connection rejected by host
              </code>
              <code className="text-[10px] text-red-300 block">
                &gt; ERR_STATUS_418
              </code>
              <code className="text-[10px] text-red-300 block">
                &gt; Check DevTools Network Tab
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
};

const SettingsApp = ({ user }) => (
  <div className="flex flex-col h-full bg-black text-white">
    <div className="p-6 pb-2">
      <h2 className="font-bold text-2xl mb-1">Settings</h2>
      <p className="text-xs text-gray-500">System Configuration</p>
    </div>

    <div className="p-4 space-y-4">
      {/* Profile Card */}
      <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-tr from-green-600 to-emerald-800 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-bold text-lg">{user.name}</div>
          <div className="text-xs text-gray-500 font-mono tracking-wider">
            {user.uid}
          </div>
        </div>
      </div>

      {/* Credits Card */}
      <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 flex justify-between items-center">
        <span className="text-sm text-gray-300">Available Credits</span>
        <span className="font-bold text-xl text-green-500 font-mono">
          ${user.credits}
        </span>
      </div>

      {/* Info Group */}
      <div className="space-y-2 pt-4">
        <p className="text-xs text-gray-500 uppercase font-bold pl-2">
          About Phone
        </p>
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
            <span className="text-sm">OS Version</span>
            <span className="text-xs text-gray-500">{SYSTEM_INFO.version}</span>
          </div>
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
            <span className="text-sm">Build Number</span>
            <span className="text-xs text-gray-500">{SYSTEM_INFO.buildId}</span>
          </div>
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
            <span className="text-sm">Developer</span>
            <span className="text-xs text-green-500 font-bold">
              {SYSTEM_INFO.developer}
            </span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-sm">Owner</span>
            <span className="text-xs text-gray-500">{SYSTEM_INFO.owner}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-auto p-6 text-center">
      <p className="text-[10px] text-gray-700">
        Ph0enixOS System Core. All rights reserved.
      </p>
    </div>
  </div>
);

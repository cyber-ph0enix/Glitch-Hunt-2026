import React, { useState, useEffect, useRef } from "react";
import { useGameEngine } from "./hooks/useGameEngine";
import { EVENT_CONFIG, LEVELS, RULEBOOK } from "./data/gameConfig";
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
  X,
} from "lucide-react";

export default function App() {
  const { user, currentLevelIndex, messages, login, submitFlag, skipLevel } =
    useGameEngine();
  const [activeApp, setActiveApp] = useState(null);
  const [booted, setBooted] = useState(false);
  const [time, setTime] = useState("");

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
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center font-mono select-none overflow-hidden">
      <div className="relative w-full h-full md:max-w-[400px] md:h-[850px] bg-black md:rounded-[3rem] md:border-[8px] md:border-neutral-800 shadow-2xl overflow-hidden flex flex-col">
        {/* STATUS BAR */}
        <div className="h-8 bg-black/90 text-white flex justify-between items-center px-6 text-xs z-50">
          <span>{time}</span>
          <div className="flex gap-2 items-center">
            <Signal size={12} /> <Wifi size={12} /> <Battery size={14} />
          </div>
        </div>

        {/* WALLPAPER */}
        <div className="flex-1 relative bg-[url('[https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop)')] bg-cover bg-center flex flex-col">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
          <div className="relative z-10 pt-10 text-center text-white/50">
            <p className="text-xs tracking-[0.3em] uppercase">
              {EVENT_CONFIG.ownerName}
            </p>
            <p className="text-[10px] opacity-70">Ph0enixOS v4.0</p>
          </div>

          {/* GRID */}
          <div className="relative z-10 mt-auto mb-20 px-6 grid grid-cols-4 gap-4">
            <AppIcon
              icon={Terminal}
              label="Terminal"
              color="bg-green-600"
              onClick={() => setActiveApp("terminal")}
              notification={currentLevelIndex < LEVELS.length}
            />
            <AppIcon
              icon={MessageSquare}
              label="Messages"
              color="bg-blue-600"
              onClick={() => setActiveApp("messages")}
              notification={messages.length > 0}
            />
            <AppIcon
              icon={StickyNote}
              label="Notes"
              color="bg-yellow-500"
              onClick={() => setActiveApp("notes")}
            />
            <AppIcon
              icon={Globe}
              label="Browser"
              color="bg-indigo-500"
              onClick={() => setActiveApp("browser")}
            />
            <AppIcon
              icon={Settings}
              label="Settings"
              color="bg-gray-600"
              onClick={() => setActiveApp("settings")}
            />
          </div>

          <div className="absolute bottom-4 left-4 right-4 h-16 bg-white/10 backdrop-blur-md rounded-3xl mx-auto"></div>
        </div>

        {/* WINDOW MODAL */}
        {activeApp && (
          <div className="absolute inset-0 z-40 bg-black animate-[slide-up_0.3s_ease-out] flex flex-col">
            <div className="h-10 border-b border-gray-800 bg-neutral-900 flex items-center justify-between px-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {activeApp}
              </span>
              <button onClick={() => setActiveApp(null)}>
                <X size={18} className="text-gray-400 hover:text-white" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative">
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
            <div
              className="h-1 bg-white/20 w-1/3 mx-auto rounded-full mb-3 mt-2 cursor-pointer"
              onClick={() => setActiveApp(null)}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const BootScreen = ({ onComplete }) => {
  // Fix: Added dependency
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-green-500 font-mono">
      <div className="animate-pulse mb-4 text-4xl font-bold tracking-widest">
        Ph0enixOS
      </div>
      <div className="mt-4 w-32 h-1 bg-gray-800 rounded overflow-hidden">
        <div className="h-full bg-green-500 animate-boot w-full"></div>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin }) => {
  const [name, setName] = useState("");
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-sm bg-black border border-green-800 p-8 rounded-2xl">
        <h2 className="text-xl text-green-500 mb-6 flex gap-2 items-center">
          <User /> AGENT LOGIN
        </h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-neutral-900 border border-green-900 text-green-400 p-4 mb-4 rounded-lg focus:outline-none focus:border-green-500"
          placeholder="ENTER CODENAME"
        />
        <button
          onClick={() => name && onLogin(name)}
          className="w-full bg-green-900/30 text-green-500 border border-green-700 p-4 rounded-lg hover:bg-green-500 font-bold"
        >
          AUTHENTICATE
        </button>
      </div>
    </div>
  );
};

// Fix: Destructuring to avoid "defined but not used" warning for 'Icon'
const AppIcon = ({ icon: IconComp, label, color, onClick, notification }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div
      className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform relative`}
    >
      <IconComp size={24} />
      {notification && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black animate-pulse"></div>
      )}
    </div>
    <span className="text-[10px] text-white font-medium">{label}</span>
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
      <div className="p-10 text-green-500 text-center">
        ALL LEVELS COMPLETE.
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-black text-green-500 font-mono text-sm">
      <div className="bg-neutral-900 p-2 text-xs flex justify-between border-b border-green-900">
        <span>CREDITS: ${credits}</span>
        <span>TARGET: {level.title}</span>
      </div>
      <div className="p-4 border-b border-green-900 bg-green-900/5 text-gray-400 text-xs">
        {level.prompt}
        {level.type === "visual" && (
          <div className="bg-white p-4 text-center select-text mt-2">
            <span className="text-white select-all">WAKE_UP_NEO</span>
          </div>
        )}
        {level.type === "html_comment" && (
          <div
            className="text-gray-600 text-center border border-gray-800 p-2 mt-2"
            dangerouslySetInnerHTML={{
              __html: "<!-- DEBUG_KEY: DEV_BACKDOOR_X7 --> Inspect source.",
            }}
          ></div>
        )}
        {level.type === "console" && (
          <button
            onClick={() => window.checkAccess && window.checkAccess()}
            className="w-full border border-red-500 text-red-500 p-2 mt-2 hover:bg-red-900/20"
          >
            EXECUTE LOGIN
          </button>
        )}
        {level.type === "encoding" && (
          <div className="bg-neutral-800 p-2 break-all text-purple-400 border border-purple-500 mt-2">
            {level.content}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {logs.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
        <div ref={scrollRef}></div>
      </div>
      <form
        onSubmit={handleCommand}
        className="p-2 border-t border-green-900 bg-neutral-900 flex gap-2"
      >
        <span className="mt-1">$</span>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-green-400"
          placeholder="Enter command..."
        />
      </form>
    </div>
  );
};

const MessagesApp = ({ messages }) => (
  <div className="flex flex-col h-full bg-neutral-900 text-white">
    <div className="p-4 border-b border-gray-800">
      <h2 className="font-bold">Encrypted Channel</h2>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages
        .slice()
        .reverse()
        .map((m) => (
          <div
            key={m.id}
            className="bg-neutral-800 p-3 rounded-2xl rounded-tl-none max-w-[85%]"
          >
            <div className="text-xs text-blue-400 font-bold mb-1">
              {m.sender}
            </div>
            <p className="text-sm text-gray-200">{m.text}</p>
            <div className="text-[10px] text-gray-500 text-right mt-1">
              {m.timestamp}
            </div>
          </div>
        ))}
    </div>
  </div>
);

const NotesApp = () => (
  <div className="flex flex-col h-full bg-yellow-50 text-black p-6 font-handwriting overflow-y-auto">
    <div className="whitespace-pre-wrap text-sm opacity-90 leading-relaxed font-mono">
      {RULEBOOK}
    </div>
  </div>
);

const BrowserApp = ({ levelId }) => {
  // Fix: Removed unused setUrl variable
  const [url] = useState(
    "[https://riverstone.internal](https://riverstone.internal)",
  );

  const handleLoad = () => {
    if (levelId === 2) {
      console.log(
        "%c[NETWORK] GET /api/auth -> { status: 418, token: 'STATUS_418_TEAPOT' }",
        "color: #ff0000; background: #000; font-size: 14px",
      );
      alert("Connection Refused. Check Network Logs (F12).");
    } else {
      alert("Gateway Timeout.");
    }
  };
  return (
    <div className="flex flex-col h-full bg-white text-black">
      <div className="p-2 bg-gray-100 border-b flex gap-2 items-center">
        <input
          value={url}
          readOnly
          className="flex-1 bg-white border rounded px-2 text-xs h-6 text-gray-500"
        />
      </div>
      <div className="flex-1 flex items-center justify-center bg-gray-50 flex-col">
        <h1 className="text-2xl font-bold text-gray-300">Intranet Gateway</h1>
        <button
          onClick={handleLoad}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Connect
        </button>
      </div>
    </div>
  );
};

const SettingsApp = ({ user }) => (
  <div className="flex flex-col h-full bg-gray-100 text-black p-4">
    <h2 className="font-bold text-xl mb-6">Profile</h2>
    <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
      <div className="font-bold text-lg">{user.name}</div>
      <div className="text-xs text-gray-500">ID: {user.uid}</div>
    </div>
    <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between">
      <span>Credits</span>
      <span className="font-bold text-green-600">${user.credits}</span>
    </div>
  </div>
);

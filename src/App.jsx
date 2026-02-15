import React, { useState, useEffect } from "react";
import { useGameEngine } from "./hooks/useGameEngine";
import { LEVELS } from "./data/gameConfig";
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
  ChevronLeft,
  Home,
  Square,
} from "lucide-react";

// app components
import TerminalApp from "./components/TerminalApp";
import MessagesApp from "./components/MessagesApp";
import NotesApp from "./components/NotesApp";
import BrowserApp from "./components/BrowserApp";
import SettingsApp from "./components/SettingsApp";

export default function App() {
  const { user, currentLevelIndex, messages, login, submitFlag, skipLevel } =
    useGameEngine();
  const [activeApp, setActiveApp] = useState(null);
  const [booted, setBooted] = useState(false);
  const [time, setTime] = useState("");

  // AUDIO ENGINE
  const playSound = (type = "notification") => {
    if (!SYSTEM_INFO?.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === "error") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        // Notification
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  useEffect(() => {
    if (messages.length > 0) playSound("notification");
  }, [messages.length]);

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

  // FIXED CONTAINER CLASS (Responsive: Full on mobile, Phone on Desktop)
  const containerClass =
    "fixed inset-0 md:relative md:h-[85vh] md:w-auto md:aspect-[9/19] md:max-h-[900px] md:rounded-[3rem] md:border-[12px] md:border-[#1a1a1a] md:shadow-2xl overflow-hidden bg-black flex flex-col ring-1 ring-white/10";

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center font-mono select-none overflow-hidden md:p-4">
      {/* PHONE CONTAINER */}
      <div className={containerClass}>
        {/* SCANLINE OVERLAY */}
        <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20"></div>

        {/* STATUS BAR */}
        <div className="h-10 bg-gradient-to-b from-black/80 to-transparent text-white flex justify-between items-center px-6 text-[11px] font-bold z-[60] shrink-0 pt-2">
          <span className="tracking-widest">{time}</span>
          <div className="flex gap-2 items-center">
            <Signal size={12} className="text-green-500" />
            <Wifi size={12} className="text-green-500" />
            <Battery size={14} className="text-green-500" />
          </div>
        </div>

        {/* WALLPAPER & DESKTOP */}
        <div className="flex-1 relative bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center flex flex-col overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[0px]"></div>

          {/* CLOCK WIDGET */}
          <div className="relative z-10 pt-12 text-center text-white/90 pointer-events-none">
            <h1 className="text-6xl font-thin tracking-tighter mb-1">
              {time.split(" ")[0]}
            </h1>
            <p className="text-[10px] tracking-[0.4em] uppercase opacity-70">
              {time.split(" ")[1]}
            </p>
          </div>

          {/* APP GRID */}
          <div className="relative z-10 mt-auto mb-20 px-6 grid grid-cols-4 gap-y-6 gap-x-2">
            <AppIcon
              icon={Terminal}
              label="Terminal"
              color="bg-neutral-800/90 border border-green-500/20"
              onClick={() => setActiveApp("terminal")}
              notification={currentLevelIndex < LEVELS.length}
            />
            <AppIcon
              icon={MessageSquare}
              label="Messages"
              color="bg-neutral-800/90 border border-blue-500/20"
              onClick={() => setActiveApp("messages")}
              notification={messages.length > 0}
            />
            <AppIcon
              icon={StickyNote}
              label="Notes"
              color="bg-neutral-800/90 border border-yellow-500/20"
              onClick={() => setActiveApp("notes")}
            />
            <AppIcon
              icon={Globe}
              label="Browser"
              color="bg-neutral-800/90 border border-indigo-500/20"
              onClick={() => setActiveApp("browser")}
            />
            <AppIcon
              icon={Settings}
              label="Settings"
              color="bg-neutral-800/90 border border-gray-500/20"
              onClick={() => setActiveApp("settings")}
            />
          </div>

          {/* DOCK BACKDROP */}
          <div className="absolute bottom-4 left-4 right-4 h-20 bg-white/5 backdrop-blur-md rounded-3xl mx-auto z-0 border border-white/5"></div>
        </div>

        {/* ACTIVE APP WINDOW */}
        {activeApp && (
          <div className="absolute inset-0 z-40 bg-[#050505] flex flex-col animate-[slide-up_0.25s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex-1 overflow-hidden relative bg-neutral-900">
              {activeApp === "terminal" && (
                <TerminalApp
                  level={LEVELS[currentLevelIndex]}
                  onSubmit={submitFlag}
                  onSkip={skipLevel}
                  credits={user.credits}
                  playSound={playSound}
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

        {/* NAVIGATION BAR */}
        <div className="h-12 bg-black flex justify-around items-center text-gray-400 z-[60] shrink-0 border-t border-neutral-900">
          <button
            onClick={() => setActiveApp(null)}
            className="p-4 active:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setActiveApp(null)}
            className="p-4 active:text-white transition-colors"
          >
            <Home size={20} />
          </button>
          <button
            onClick={() => setActiveApp(null)}
            className="p-4 active:text-white transition-colors"
          >
            <Square size={16} fill="currentColor" className="opacity-50" />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- SHARED COMPONENTS (Keep these as they were or minimal updates) ---
const BootScreen = ({ onComplete }) => {
  useEffect(() => {
    const t = setTimeout(onComplete, 2000);
    return () => clearTimeout(t);
  }, [onComplete]);
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-green-500 font-mono">
      <div className="animate-pulse mb-4 text-4xl font-bold tracking-widest">
        {SYSTEM_INFO.osName}
      </div>
      <div className="text-xs opacity-50 mb-8">{SYSTEM_INFO.buildId}</div>
      <div className="w-48 h-1 bg-gray-900 rounded overflow-hidden">
        <div className="h-full bg-green-600 animate-boot w-full shadow-[0_0_10px_#00ff00]"></div>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin }) => {
  const [name, setName] = useState("");
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 font-mono">
      <div className="w-full max-w-sm bg-black border border-green-900/50 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-900/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30 text-green-500 shadow-[0_0_15px_rgba(0,255,0,0.1)]">
            <User size={32} />
          </div>
          <h2 className="text-xl text-white font-bold tracking-wider">
            IDENTITY VERIFICATION
          </h2>
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-neutral-900 border border-green-900 text-green-400 p-4 mb-4 rounded-xl text-center focus:outline-none focus:border-green-500 placeholder-green-900/50 transition-all"
          placeholder="ENTER CODENAME"
        />
        <button
          onClick={() => name && onLogin(name)}
          className="w-full bg-green-600 text-black p-4 rounded-xl hover:bg-green-500 font-bold transition-all shadow-lg shadow-green-900/20 active:scale-95"
        >
          CONNECT
        </button>
      </div>
    </div>
  );
};

const AppIcon = ({ icon: Icon, label, color, onClick, notification }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 group w-full"
  >
    <div
      className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-95 transition-transform relative`}
    >
      <Icon size={24} />
      {notification && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-pulse"></div>
      )}
    </div>
    <span className="text-[10px] text-gray-400 font-medium tracking-tight group-hover:text-white transition-colors">
      {label}
    </span>
  </button>
);

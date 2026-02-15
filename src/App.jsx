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
  Minimize2,
  Maximize2,
} from "lucide-react";

// --- IMPORT MODULAR APPS ---
// Ensure these files exist in src/components/apps/
import TerminalApp from "./components/TerminalApp";
import MessagesApp from "./components/MessagesApp";
import NotesApp from "./components/NotesApp";
import BrowserApp from "./components/BrowserApp";
import SettingsApp from "./components/SettingsApp";

const NOTIFICATION_SOUND =
  "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU";

export default function App() {
  const { user, currentLevelIndex, messages, login, submitFlag, skipLevel } =
    useGameEngine();
  const [activeApp, setActiveApp] = useState(null);
  const [booted, setBooted] = useState(false);
  const [time, setTime] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sound Effect Helper
  const notify = () => {
    if (SYSTEM_INFO?.vibrationEnabled && navigator.vibrate)
      navigator.vibrate(200);
    if (SYSTEM_INFO?.soundEnabled) {
      try {
        new Audio(NOTIFICATION_SOUND).play().catch(() => {});
      } catch (e) {}
    }
  };

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

  // Dynamic Sizing Logic for "Native Feel"
  const containerClass =
    isFullscreen || window.innerWidth < 768
      ? "fixed inset-0 w-full h-full rounded-none border-0"
      : "relative h-[85vh] w-auto aspect-[9/19] max-h-[900px] rounded-[2.5rem] border-[8px] shadow-2xl";

  return (
    <div className="min-h-screen w-full bg-[#111] flex items-center justify-center font-mono select-none overflow-hidden md:p-4">
      {/* PHONE CONTAINER */}
      <div
        className={`${containerClass} transition-all duration-300 ease-in-out bg-black overflow-hidden flex flex-col border-neutral-800 relative`}
      >
        {/* CRT SCANLINE EFFECT */}
        <div className="scanline opacity-5 pointer-events-none absolute inset-0 z-50"></div>

        {/* STATUS BAR (Global Overlay) */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-black/90 text-white flex justify-between items-center px-5 text-[10px] z-[60]">
          <span className="font-bold tracking-widest">{time}</span>
          <div className="flex gap-2 items-center">
            <Signal size={10} className="text-green-500" />
            <Wifi size={10} className="text-green-500" />
            <Battery size={12} className="text-green-500" />
          </div>
        </div>

        {/* WALLPAPER & DESKTOP */}
        <div className="flex-1 relative bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center flex flex-col overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>

          {/* DESKTOP CONTROLS (PC Only - Maximize Button) */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="absolute top-10 left-4 z-20 text-white/20 hover:text-white md:block hidden transition-colors"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          {/* CLOCK WIDGET */}
          <div className="relative z-10 pt-16 text-center text-white/80 pointer-events-none">
            <h1 className="text-6xl font-thin tracking-tighter mb-1">
              {time.split(" ")[0]}
            </h1>
            <p className="text-[10px] tracking-[0.5em] uppercase opacity-60">
              {time.split(" ")[1]}
            </p>
            <p className="text-[8px] mt-2 opacity-40">{SYSTEM_INFO.owner}</p>
          </div>

          {/* APP GRID */}
          <div className="relative z-10 mt-auto mb-28 px-6 grid grid-cols-4 gap-y-8 gap-x-4">
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

          {/* DOCK (Visual Only) */}
          <div className="absolute bottom-6 left-4 right-4 h-20 bg-white/5 backdrop-blur-xl rounded-3xl mx-auto z-0 border border-white/5"></div>
        </div>

        {/* ACTIVE APP WINDOW (Full Overlay) */}
        {activeApp && (
          <div className="absolute inset-0 z-40 bg-black flex flex-col animate-[slide-up_0.25s_cubic-bezier(0.16,1,0.3,1)]">
            {/* APP CONTENT AREA - Loads Modular Components */}
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

        {/* NAVIGATION BAR (Android Style) */}
        <div className="h-12 bg-black flex justify-around items-center text-gray-400 z-[60] shrink-0 border-t border-neutral-800">
          <button
            onClick={() => setActiveApp(null)}
            className="p-4 active:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setActiveApp(null)}
            className="p-4 active:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <Home size={20} />
          </button>
          <button
            onClick={() => setActiveApp(null)}
            className="p-4 active:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <Square size={16} fill="currentColor" className="opacity-50" />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- SHARED SYSTEM COMPONENTS ---

const BootScreen = ({ onComplete }) => {
  useEffect(() => {
    const t = setTimeout(onComplete, 2500);
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
          <p className="text-xs text-green-700 mt-1">Secure Gateway Access</p>
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
    <span className="text-[10px] text-gray-300 font-medium tracking-tight group-hover:text-white transition-colors">
      {label}
    </span>
  </button>
);

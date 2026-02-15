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
  Cpu,
  FolderOpen,
  Camera,
  ChevronLeft,
  Home,
  Square,
  X,
  Minus,
  Maximize2,
} from "lucide-react";

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- AUDIO ENGINE ---
  const playSound = (type = "click") => {
    if (!SYSTEM_INFO?.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        // UI Click
        osc.type = "triangle";
        osc.frequency.setValueAtTime(2000, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {}
  };

  // --- RESPONSIVE LISTENER ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- TIME SYNC ---
  useEffect(() => {
    const t = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);

  if (!booted) return <BootScreen onComplete={() => setBooted(true)} />;
  if (!user) return <LoginScreen onLogin={login} />;

  // --- DYNAMIC APPS LIST ---
  // If we are on mobile, all apps are in the grid.
  // If on desktop, "pinned" apps are in the dock, others in grid.
  const ALL_APPS = [
    {
      id: "terminal",
      label: "Terminal",
      icon: Terminal,
      color: "text-green-400",
    },
    {
      id: "messages",
      label: "Comms",
      icon: MessageSquare,
      color: "text-blue-400",
      notify: messages.length > 0,
    },
    { id: "browser", label: "Net", icon: Globe, color: "text-cyan-400" },
    { id: "files", label: "Files", icon: FolderOpen, color: "text-yellow-400" },
    { id: "notes", label: "Notes", icon: StickyNote, color: "text-orange-400" },
    { id: "settings", label: "Sys", icon: Settings, color: "text-gray-400" },
    { id: "camera", label: "Cam", icon: Camera, color: "text-red-400" },
  ];

  const PINNED_APPS = [
    "terminal",
    "messages",
    "browser",
    "files",
    "notes",
    "settings",
  ];

  return (
    <div className="fixed inset-0 bg-[#050505] font-mono text-gray-200 overflow-hidden flex flex-col">
      {/* 1. STATUS BAR (Universal) */}
      <div className="h-8 bg-black/60 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-4 text-[11px] font-bold z-50 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-white tracking-widest">{time}</span>
          <span className="hidden md:inline px-2 py-0.5 bg-white/10 rounded text-[9px] text-green-400 tracking-wider">
            {isMobile ? "MOBILE_DATA" : "ETHERNET_CONNECTED"}
          </span>
        </div>
        <div className="flex gap-3 items-center">
          <Signal
            size={12}
            className={isMobile ? "text-green-500" : "text-gray-600"}
          />
          <Wifi size={12} className="text-green-500" />
          <Battery size={14} className="text-green-500" />
        </div>
      </div>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 relative bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center overflow-hidden group">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

        {/* DESKTOP GRID (Universal, but hidden if App is Open on Mobile) */}
        <div
          className={`absolute inset-0 p-6 grid grid-cols-4 md:grid-cols-8 gap-4 content-start transition-opacity duration-300 ${activeApp && isMobile ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          {ALL_APPS.map((app) =>
            // On Desktop, hide Pinned apps from Grid (they are in Dock). On Mobile, show all.
            !isMobile || !PINNED_APPS.includes(app.id) ? (
              <button
                key={app.id}
                onClick={() => {
                  playSound();
                  setActiveApp(app.id);
                }}
                className="flex flex-col items-center gap-2 group/icon"
              >
                <div className="w-14 h-14 bg-black/50 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-lg group-hover/icon:bg-white/10 transition-all">
                  <app.icon size={24} className={app.color} />
                  {app.notify && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <span className="text-[10px] text-gray-300 bg-black/50 px-2 rounded backdrop-blur-sm">
                  {app.label}
                </span>
              </button>
            ) : null,
          )}
        </div>

        {/* ACTIVE APP WINDOW */}
        {activeApp && (
          <AppWindow
            appId={activeApp}
            isMobile={isMobile}
            onClose={() => setActiveApp(null)}
          >
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
            {/* Stub for new apps */}
            {(activeApp === "files" || activeApp === "camera") && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 text-xs font-mono p-8 text-center">
                <Cpu size={48} className="mb-4 opacity-20" />
                [ MODULE ENCRYPTED ]<br />
                ACCESS DENIED BY ADMINISTRATOR
              </div>
            )}
          </AppWindow>
        )}
      </div>

      {/* 3. FOOTER AREA (Dual Mode) */}

      {/* MODE A: MOBILE NAVBAR (Only visible on Mobile) */}
      {isMobile && (
        <div className="h-12 bg-black border-t border-[#222] flex justify-around items-center text-gray-400 z-50 shrink-0 pb-1">
          <button
            onClick={() => setActiveApp(null)}
            className="p-4 active:text-white active:scale-95 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setActiveApp(null)}
            className="p-4 active:text-white active:scale-95 transition-all"
          >
            <Home size={22} />
          </button>
          <button className="p-4 opacity-50 cursor-not-allowed">
            <Square size={18} fill="currentColor" />
          </button>
        </div>
      )}

      {/* MODE B: DESKTOP DOCK (Only visible on Desktop) */}
      {!isMobile && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[100]">
          <div className="glass-panel rounded-2xl px-4 py-3 flex gap-4 shadow-2xl items-end">
            {PINNED_APPS.map((id) => {
              const app = ALL_APPS.find((a) => a.id === id);
              return (
                <DockIcon
                  key={id}
                  icon={app.icon}
                  label={app.label}
                  color={app.color}
                  isActive={activeApp === id}
                  onClick={() => {
                    playSound();
                    setActiveApp(id);
                  }}
                  notify={app.notify}
                />
              );
            })}
            {/* Separator for unpinned active apps could go here */}
            <div className="w-[1px] h-8 bg-white/10 mx-2 self-center"></div>
            <button className="group relative p-2 rounded-xl hover:bg-white/10 transition-all">
              <div className="grid grid-cols-2 gap-0.5 w-6 h-6 opacity-50 group-hover:opacity-100">
                <div className="bg-white rounded-[1px]"></div>
                <div className="bg-white rounded-[1px]"></div>
                <div className="bg-white rounded-[1px]"></div>
                <div className="bg-white rounded-[1px]"></div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

// 1. AppWindow: The wrapper that handles Scrolling & Minimizing
const AppWindow = ({ appId, isMobile, onClose, children }) => {
  // Mobile: Fullscreen. Desktop: Centered Floating Window.
  const windowClass = isMobile
    ? "absolute inset-0 z-40 bg-[#050505] flex flex-col animate-in slide-in-from-bottom duration-300"
    : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[80%] max-w-5xl bg-[#0a0a0a] border border-[#333] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-40 ring-1 ring-white/10";

  return (
    <div className={windowClass}>
      {/* WINDOW HEADER (Visible on Desktop OR Mobile if preferred) */}
      <div className="h-9 bg-[#111] border-b border-[#222] flex items-center justify-between px-3 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {appId}.EXE
          </span>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-2">
          {!isMobile && (
            <>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white"
              >
                <Minus size={12} />
              </button>
              <button className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white">
                <Maximize2 size={12} />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-900/50 rounded text-gray-500 hover:text-red-400 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* SCROLLABLE CONTENT AREA - This fixes the scroll bug */}
      <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#050505]">
        {children}
      </div>
    </div>
  );
};

// 2. DockIcon: Handles the hover effects cleanly
const DockIcon = ({ icon: Icon, label, color, onClick, isActive, notify }) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center justify-end"
    >
      {/* Tooltip (Only on direct hover) */}
      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/80 text-white text-[9px] px-2 py-1 rounded border border-white/10 pointer-events-none mb-2 whitespace-nowrap">
        {label}
      </div>

      {/* Icon Container */}
      <div
        className={`
        w-12 h-12 rounded-xl flex items-center justify-center 
        border transition-all duration-200 ease-out
        ${isActive ? "bg-white/10 border-white/30 mb-2" : "bg-[#1a1a1a]/80 border-white/5 hover:mb-2 hover:scale-110 hover:bg-[#2a2a2a]"}
      `}
      >
        <Icon size={24} className={`${color} opacity-90`} />
        {notify && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1a1a1a] animate-pulse"></div>
        )}
      </div>

      {/* Active Dot */}
      <div
        className={`w-1 h-1 bg-white rounded-full mt-1 transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`}
      ></div>
    </button>
  );
};

const BootScreen = ({ onComplete }) => {
  useEffect(() => {
    setTimeout(onComplete, 2000);
  }, [onComplete]);
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-green-500 z-[9999]">
      <Cpu size={64} className="mb-6 animate-pulse" />
      <div className="text-3xl font-black tracking-[0.5em] mb-2 glitch-text">
        Ph0enixOS
      </div>
      <div className="text-xs text-green-800 font-mono">
        KERNEL_V4.0.2 :: SECURE_BOOT
      </div>
      <div className="w-64 h-1 bg-gray-900 rounded-full mt-8 overflow-hidden">
        <div className="h-full bg-green-500 animate-[bootUp_2s_ease-out_forwards] w-full origin-left"></div>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin }) => {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#222] p-8 rounded-2xl shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-600 to-transparent"></div>
        <div className="w-20 h-20 bg-[#111] rounded-full mx-auto mb-6 flex items-center justify-center border border-[#333] shadow-[0_0_30px_rgba(34,197,94,0.1)]">
          <User size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">IDENTIFY</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name && onLogin(name)}
          className="w-full bg-[#050505] border border-[#333] text-green-500 p-4 rounded-lg text-center font-mono focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600/50 transition-all placeholder:text-gray-800 mt-6"
          placeholder="CODENAME"
          autoFocus
        />
        <button
          onClick={() => name && onLogin(name)}
          className="w-full mt-4 bg-green-700 hover:bg-green-600 text-black font-bold py-3 rounded-lg transition-all active:scale-95"
        >
          INITIALIZE LINK
        </button>
      </div>
    </div>
  );
};

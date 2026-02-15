import React, { useState, useEffect, useRef } from "react";
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
  Minimize2,
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

  // Audio Engine
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
      } else {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(2000, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      }
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () =>
        setTime(
          new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        ),
      1000,
    );
    return () => clearInterval(t);
  }, []);

  if (!booted) return <BootScreen onComplete={() => setBooted(true)} />;
  if (!user) return <LoginScreen onLogin={login} />;

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

  // Logic: On mobile, we show ALL apps in grid. On desktop, we hide pinned apps from grid.
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
      {/* STATUS BAR */}
      <div className="h-8 bg-black/40 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-4 text-[11px] font-bold z-50 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <span className="text-white tracking-widest">{time}</span>
          <span className="hidden md:inline px-2 py-0.5 bg-white/10 rounded text-[9px] text-green-400 tracking-wider">
            {isMobile ? "4G_LTE" : "ETH_01 :: CONNECTED"}
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

      {/* WORKSPACE */}
      <div className="flex-1 relative bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center overflow-hidden group">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

        {/* APP GRID */}
        {/* On Mobile: Show ALL apps. On Desktop: Show only unpinned (or all if you prefer). */}
        {/* FIX: Removed the logic that hid apps on mobile. Now simple and robust. */}
        <div
          className={`absolute inset-0 p-6 grid grid-cols-4 md:grid-cols-8 gap-4 content-start transition-opacity duration-300 ${activeApp && isMobile ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          {ALL_APPS.map((app) => {
            // Desktop: Hide pinned apps from grid to clean up UI (optional, but requested behavior)
            if (!isMobile && PINNED_APPS.includes(app.id)) return null;
            return (
              <button
                key={app.id}
                onClick={() => {
                  playSound();
                  setActiveApp(app.id);
                }}
                className="flex flex-col items-center gap-2 group/icon"
              >
                <div className="w-14 h-14 bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-lg group-hover/icon:bg-white/10 group-hover/icon:scale-105 transition-all duration-200">
                  <app.icon size={24} className={app.color} />
                  {app.notify && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <span className="text-[10px] text-gray-300 bg-black/50 px-2 rounded backdrop-blur-sm shadow-sm">
                  {app.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE WINDOW */}
        {activeApp && (
          <DraggableWindow
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
            {(activeApp === "files" || activeApp === "camera") && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 text-xs font-mono p-8 text-center select-none">
                <Cpu size={48} className="mb-4 opacity-20" />
                <div className="border border-red-900/30 bg-red-900/10 p-4 rounded">
                  <p className="text-red-400 font-bold mb-1">ACCESS DENIED</p>
                  <p className="opacity-50">MODULE ENCRYPTED</p>
                </div>
              </div>
            )}
          </DraggableWindow>
        )}
      </div>

      {/* FOOTER: NAVBAR (Mobile) OR DOCK (Desktop) */}
      {isMobile ? (
        <div className="h-14 bg-black border-t border-[#222] flex justify-around items-center text-gray-400 z-50 shrink-0 pb-2">
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
          <button className="p-4 opacity-30">
            <Square size={18} fill="currentColor" />
          </button>
        </div>
      ) : (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[100]">
          {/* DOCK CONTAINER: Fixed Height to prevent jumping */}
          <div className="glass-panel h-16 rounded-2xl px-4 flex gap-3 shadow-2xl items-center justify-center relative">
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
          </div>
        </div>
      )}
    </div>
  );
}

// --- DRAGGABLE WINDOW COMPONENT ---
const DraggableWindow = ({ appId, isMobile, onClose, children }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Offset from center
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Center window on mount
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
    setIsMaximized(false);
  }, [appId]);

  const handleMouseDown = (e) => {
    if (isMaximized || isMobile) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Dynamic Classes based on state
  // Mobile: Always fixed inset-0.
  // Desktop:
  //   - Maximized: fixed inset-0 m-4 rounded-xl
  //   - Windowed: fixed center + transform translate

  const mobileClass =
    "absolute inset-0 z-40 bg-[#050505] flex flex-col animate-in slide-in-from-bottom duration-300";

  const desktopBase =
    "absolute z-40 bg-[#0a0a0a] border border-[#333] shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10 window-transition";

  const desktopMaximized = "inset-4 rounded-xl";
  const desktopWindowed = "w-[800px] h-[600px] rounded-xl"; // Fixed default size

  // Calculate style for desktop windowed mode
  const windowStyle =
    !isMobile && !isMaximized
      ? {
          left: `calc(50% + ${position.x}px)`,
          top: `calc(50% + ${position.y}px)`,
          transform: "translate(-50%, -50%)",
        }
      : {};

  const finalClass = isMobile
    ? mobileClass
    : `${desktopBase} ${isMaximized ? desktopMaximized : desktopWindowed}`;

  return (
    <div className={finalClass} style={windowStyle}>
      {/* HEADER / DRAG HANDLE */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={() => !isMobile && setIsMaximized(!isMaximized)}
        className={`h-9 bg-[#111] border-b border-[#222] flex items-center justify-between px-3 shrink-0 select-none ${!isMobile && !isMaximized ? "cursor-grab active:cursor-grabbing" : ""}`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {appId}.EXE
          </span>
        </div>

        <div className="flex items-center gap-1">
          {!isMobile && (
            <>
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1.5 hover:bg-white/10 rounded text-gray-500 hover:text-white transition-colors"
              >
                {isMaximized ? (
                  <Minimize2 size={12} />
                ) : (
                  <Maximize2 size={12} />
                )}
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-red-900/50 rounded text-gray-500 hover:text-red-400 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#050505]">
        {children}
      </div>
    </div>
  );
};

// --- STABLE DOCK COMPONENT ---
const DockIcon = ({ icon: Icon, label, color, onClick, isActive, notify }) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center w-10"
    >
      {/* Tooltip */}
      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/90 text-white text-[9px] px-2 py-1 rounded border border-white/10 pointer-events-none whitespace-nowrap z-50">
        {label}
      </div>

      {/* Icon: Scale transform only, no layout shift */}
      <div
        className={`
        relative w-10 h-10 rounded-xl flex items-center justify-center 
        transition-all duration-200 ease-out origin-bottom
        group-hover:scale-125 group-hover:-translate-y-2
        ${isActive ? "bg-white/10 border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "bg-transparent hover:bg-[#2a2a2a]"}
      `}
      >
        <Icon
          size={20}
          className={`${color} ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}
        />
        {notify && (
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#000] animate-pulse"></div>
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

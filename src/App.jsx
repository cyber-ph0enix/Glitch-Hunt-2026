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
  Music,
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
  const [isFullscreen, setIsFullscreen] = useState(false);

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

      if (type === "error") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        // UI Click / Tap
        osc.type = "triangle";
        osc.frequency.setValueAtTime(2000, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (messages.length > 0) playSound("success");
  }, [messages.length]);

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

  // --- DYNAMIC LAYOUT LOGIC ---
  // Mobile: Fixed full screen.
  // Desktop: Responsive "Tablet/CyberDeck" container.
  const containerClass = `
    transition-all duration-500 ease-out
    fixed inset-0 
    md:relative md:w-[90vw] md:h-[85vh] md:max-w-[1200px] md:max-h-[900px]
    md:rounded-[2rem] md:border-[1px] md:border-[#333] md:shadow-[0_0_50px_rgba(0,0,0,0.5)]
    bg-black flex flex-col overflow-hidden ring-1 ring-white/10
  `;

  return (
    <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center font-mono md:p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#111] via-[#000] to-[#000]">
      <div className={containerClass}>
        {/* CRT SCANLINE OVERLAY */}
        <div className="absolute inset-0 pointer-events-none z-[9999] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-10"></div>

        {/* STATUS BAR */}
        <div className="h-8 bg-black/40 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-4 text-[11px] font-bold text-gray-400 z-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-white tracking-widest">{time}</span>
            <span className="hidden md:inline px-2 py-0.5 bg-white/10 rounded text-[9px] text-green-400">
              CONNECTED
            </span>
          </div>
          <div className="flex gap-3 items-center">
            <Signal size={12} className="text-green-500" />
            <Wifi size={12} className="text-green-500" />
            <Battery size={14} className="text-green-500" />
          </div>
        </div>

        {/* DESKTOP WORKSPACE */}
        <div className="flex-1 relative bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center flex flex-col overflow-hidden group">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>

          {/* APP WINDOW (When Open) */}
          <div
            className={`absolute inset-0 z-40 transition-all duration-300 ${activeApp ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
          >
            {activeApp && (
              <div className="w-full h-full bg-[#0a0a0a] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* APP HEADER */}
                <div className="h-10 bg-[#1a1a1a] border-b border-[#333] flex items-center justify-between px-4 shrink-0">
                  <span className="text-xs font-bold text-gray-300 tracking-wider flex items-center gap-2 uppercase">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    {activeApp}
                  </span>
                  <button
                    onClick={() => {
                      playSound();
                      setActiveApp(null);
                    }}
                    className="p-1.5 hover:bg-red-500/20 rounded-md text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Minimize2 size={14} />
                  </button>
                </div>

                {/* APP CONTENT AREA - SCROLLABLE */}
                <div className="flex-1 overflow-hidden relative">
                  {activeApp === "terminal" && (
                    <TerminalApp
                      level={LEVELS[currentLevelIndex]}
                      onSubmit={submitFlag}
                      onSkip={skipLevel}
                      credits={user.credits}
                      playSound={playSound}
                    />
                  )}
                  {activeApp === "messages" && (
                    <MessagesApp messages={messages} />
                  )}
                  {activeApp === "notes" && <NotesApp />}
                  {activeApp === "browser" && (
                    <BrowserApp levelId={currentLevelIndex} />
                  )}
                  {activeApp === "settings" && <SettingsApp user={user} />}
                  {(activeApp === "files" || activeApp === "camera") && (
                    <div className="flex items-center justify-center h-full text-gray-500 text-xs font-mono">
                      [ ACCESS DENIED: MODULE ENCRYPTED ]
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* DOCK / APP GRID */}
          {/* This sits at the bottom, mimicking macOS/iOS Dock */}
          <div
            className={`mt-auto mb-6 mx-auto z-30 transition-all duration-300 ${activeApp ? "translate-y-24 opacity-0" : "translate-y-0 opacity-100"}`}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex gap-4 md:gap-6 shadow-2xl scale-90 md:scale-100 origin-bottom">
              <DockIcon
                icon={Terminal}
                label="Terminal"
                color="text-green-400"
                onClick={() => {
                  playSound();
                  setActiveApp("terminal");
                }}
                notification={currentLevelIndex < LEVELS.length}
              />
              <DockIcon
                icon={MessageSquare}
                label="Comms"
                color="text-blue-400"
                onClick={() => {
                  playSound();
                  setActiveApp("messages");
                }}
                notification={messages.length > 0}
              />
              <DockIcon
                icon={Globe}
                label="Net"
                color="text-cyan-400"
                onClick={() => {
                  playSound();
                  setActiveApp("browser");
                }}
              />
              <div className="w-[1px] h-10 bg-white/10 my-auto"></div>{" "}
              {/* Divider */}
              <DockIcon
                icon={FolderOpen}
                label="Files"
                color="text-yellow-400"
                onClick={() => {
                  playSound();
                  setActiveApp("files");
                }}
              />
              <DockIcon
                icon={StickyNote}
                label="Notes"
                color="text-orange-400"
                onClick={() => {
                  playSound();
                  setActiveApp("notes");
                }}
              />
              <DockIcon
                icon={Settings}
                label="Sys"
                color="text-gray-400"
                onClick={() => {
                  playSound();
                  setActiveApp("settings");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const DockIcon = ({ icon: Icon, label, color, onClick, notification }) => (
  <button
    onClick={onClick}
    className="group relative flex flex-col items-center gap-1 min-w-[50px]"
  >
    <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-white/5 shadow-lg group-hover:-translate-y-2 group-hover:scale-110 group-hover:border-white/20 transition-all duration-200 ease-out">
      <Icon
        size={24}
        className={`${color} opacity-80 group-hover:opacity-100`}
      />
    </div>
    {notification && (
      <div className="absolute top-0 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1a1a1a] animate-pulse"></div>
    )}
    <span className="text-[9px] text-gray-400 opacity-0 group-hover:opacity-100 absolute -top-8 bg-black/80 px-2 py-1 rounded backdrop-blur transition-opacity border border-white/10 whitespace-nowrap">
      {label}
    </span>
    {/* Reflection Dot */}
    <div className="w-1 h-1 bg-white/20 rounded-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </button>
);

const BootScreen = ({ onComplete }) => {
  useEffect(() => {
    setTimeout(onComplete, 2500);
  }, [onComplete]);
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-green-500 z-[10000]">
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
        <p className="text-xs text-gray-500 mb-8 font-mono">
          ENTER AGENT ALIAS TO CONNECT
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name && onLogin(name)}
          className="w-full bg-[#050505] border border-[#333] text-green-500 p-4 rounded-lg text-center font-mono focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600/50 transition-all placeholder:text-gray-800"
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

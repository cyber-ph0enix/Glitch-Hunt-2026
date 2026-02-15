import React, { useState } from "react";
import { SYSTEM_INFO } from "../data/build.prop.js";
import { Hammer } from "lucide-react";

export default function SettingsApp({ user }) {
  const [clicks, setClicks] = useState(0);
  const [devEnabled, setDevEnabled] = useState(false);

  const handleBuildClick = () => {
    if (devEnabled) return;
    const newCount = clicks + 1;
    setClicks(newCount);

    // Developer Unlock Mechanic
    if (newCount >= 7) {
      setDevEnabled(true);
      // You can trigger a global unlock here later if you want
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white pt-8 px-4 font-sans">
      <div className="p-2 pb-4">
        <h2 className="font-bold text-2xl mb-1">Settings</h2>
        <p className="text-xs text-gray-500">System Configuration</p>
      </div>

      <div className="space-y-4">
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

        {/* DEV MODE BANNER */}
        {devEnabled && (
          <div className="bg-red-900/10 border border-red-500/30 p-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-right fade-in duration-300">
            <Hammer className="text-red-500" size={20} />
            <div>
              <h3 className="font-bold text-red-500 text-sm">
                DEVELOPER OPTIONS
              </h3>
              <p className="text-[10px] text-red-300/70">Root access granted</p>
            </div>
          </div>
        )}

        {/* Info Group */}
        <div className="space-y-2 pt-2">
          <p className="text-xs text-gray-500 uppercase font-bold pl-2">
            About Phone
          </p>
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
              <span className="text-sm">OS Version</span>
              <span className="text-xs text-gray-500">
                {SYSTEM_INFO.version}
              </span>
            </div>
            {/* Build Number - Clickable */}
            <button
              onClick={handleBuildClick}
              className="w-full p-4 border-b border-neutral-800 flex justify-between items-center hover:bg-white/5 transition-colors text-left"
            >
              <span className="text-sm">Build Number</span>
              <span className="text-xs text-gray-500 font-mono">
                {SYSTEM_INFO.buildId}
              </span>
            </button>
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

      <div className="mt-auto p-6 text-center pb-20">
        <p className="text-[10px] text-gray-700">
          Ph0enixOS System Core. All rights reserved.
        </p>
      </div>
    </div>
  );
}

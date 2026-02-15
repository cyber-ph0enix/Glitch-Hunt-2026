import React from "react";
import { SYSTEM_INFO } from "../data/build.prop.js";

export default function SettingsApp({ user }) {
  return (
    <div className="flex flex-col h-full bg-black text-white pt-8">
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
              <span className="text-xs text-gray-500">
                {SYSTEM_INFO.version}
              </span>
            </div>
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
              <span className="text-sm">Build Number</span>
              <span className="text-xs text-gray-500">
                {SYSTEM_INFO.buildId}
              </span>
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

      <div className="mt-auto p-6 text-center pb-20">
        <p className="text-[10px] text-gray-700">
          Ph0enixOS System Core. All rights reserved.
        </p>
      </div>
    </div>
  );
}

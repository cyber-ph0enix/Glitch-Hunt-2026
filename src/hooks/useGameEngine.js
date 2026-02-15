import { useState, useEffect } from "react";
import { LEVELS, sha256, EVENT_CONFIG } from "../data/gameConfig";
import Papa from "papaparse";

export function useGameEngine() {
  // --- 1. STATE WITH LAZY INITIALIZATION (Fixes "Cascading Renders") ---

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("ph0enix_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [currentLevelIndex, setCurrentLevelIndex] = useState(() => {
    const saved = localStorage.getItem("ph0enix_level");
    return saved ? parseInt(saved) : 0;
  });

  const [messages, setMessages] = useState([]);

  // Lazy init for Date.now() prevents "Impure function" error
  const [levelStartTime, setLevelStartTime] = useState(() => Date.now());
  const [manualLeaks, setManualLeaks] = useState([]);

  // --- 2. HELPER FUNCTIONS (Defined BEFORE usage) ---

  const addMessage = (sender, text, id = null) => {
    setMessages((prev) => {
      // Prevent duplicates based on ID
      const newId = id || Date.now();
      if (prev.some((m) => m.id === newId)) return prev;

      return [
        ...prev,
        {
          sender,
          text,
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          id: newId,
        },
      ];
    });
  };

  const reportScore = (userData, lvl) => {
    // Check if URL exists and is a string before checking startsWith
    const url = EVENT_CONFIG.googleScriptUrl;
    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      console.warn("Score reporting disabled (Missing/Invalid URL)");
      return;
    }

    fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userData, level: lvl }),
    }).catch((err) => console.log("Report error:", err));
  };

  const login = (name) => {
    const uid = "AGT-" + Math.floor(Math.random() * 99999);
    const newUser = { name, uid, credits: 0 };
    setUser(newUser);
    localStorage.setItem("ph0enix_user", JSON.stringify(newUser));
    reportScore(newUser, 0);
    // Add welcome message immediately upon login
    addMessage(
      "System",
      "Ph0enixOS Loaded. Check 'Notes' for Rules.",
      "welcome_msg",
    );
  };

  const submitFlag = async (input) => {
    if (currentLevelIndex >= LEVELS.length)
      return { success: false, msg: "Mission Complete." };

    const level = LEVELS[currentLevelIndex];
    const hash = await sha256(input.trim());

    if (hash === level.answerHash) {
      const nextLvl = currentLevelIndex + 1;
      const updatedUser = { ...user, credits: user.credits + level.reward };

      setUser(updatedUser);
      setCurrentLevelIndex(nextLvl);
      setLevelStartTime(Date.now()); // Reset timer for hint

      localStorage.setItem("ph0enix_user", JSON.stringify(updatedUser));
      localStorage.setItem("ph0enix_level", nextLvl);

      addMessage(
        "System",
        `Level ${level.id} Cleared. +${level.reward} Credits.`,
      );
      reportScore(updatedUser, nextLvl);

      return { success: true, msg: "Access Granted." };
    }
    return { success: false, msg: "Invalid Flag." };
  };

  const skipLevel = () => {
    if (user.credits < 250) return { success: false, msg: "Need 250 Credits." };

    const nextLvl = currentLevelIndex + 1;
    const updatedUser = { ...user, credits: user.credits - 250 };

    setUser(updatedUser);
    setCurrentLevelIndex(nextLvl);
    setLevelStartTime(Date.now());

    localStorage.setItem("ph0enix_user", JSON.stringify(updatedUser));
    localStorage.setItem("ph0enix_level", nextLvl);

    addMessage("System", `Level Skipped. -250 Credits.`);
    reportScore(updatedUser, nextLvl);

    return { success: true, msg: "Skipping..." };
  };

  // --- 3. EFFECTS ---

  // Auto Hints System
  useEffect(() => {
    if (!user || currentLevelIndex >= LEVELS.length) return;

    const level = LEVELS[currentLevelIndex];
    const timer = setInterval(() => {
      const elapsed = (Date.now() - levelStartTime) / 1000;

      if (elapsed > level.hintDelay) {
        const hintId = `hint_${level.id}`;
        // addMessage handles duplicate checking internally now
        addMessage("Unknown", `[HINT]: ${level.hintText}`, hintId);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(timer);
  }, [currentLevelIndex, levelStartTime, user]); // Minimal dependencies

  // Manual Leaks (Google Sheets CSV)
  useEffect(() => {
    // Safer check for the CSV URL
    const url = EVENT_CONFIG.googleSheetCsvUrl;
    if (!user || !url || typeof url !== "string" || !url.startsWith("http"))
      return;

    const fetchLeaks = () => {
      Papa.parse(url, {
        download: true,
        header: true,
        complete: (results) => {
          // Safety check for data existence
          if (!results || !results.data) return;

          const newLeaks = results.data.map((r) => r.message).filter((m) => m);
          if (newLeaks.length > manualLeaks.length) {
            const latest = newLeaks[newLeaks.length - 1];
            addMessage("The Architect", latest, `leak_${Date.now()}`);
            setManualLeaks(newLeaks);
          }
        },
        error: (err) => console.log("Leak fetch skipped"),
      });
    };
    const poller = setInterval(fetchLeaks, 20000);
    return () => clearInterval(poller);
  }, [user, manualLeaks]);

  return {
    user,
    currentLevelIndex,
    messages,
    login,
    submitFlag,
    skipLevel,
    addMessage,
  };
}

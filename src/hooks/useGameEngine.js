import { useState, useEffect } from "react";
import { LEVELS, sha256, EVENT_CONFIG } from "../data/gameConfig";
import Papa from "papaparse";

export function useGameEngine() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("ph0enix_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [currentLevelIndex, setCurrentLevelIndex] = useState(() => {
    const saved = localStorage.getItem("ph0enix_level");
    return saved ? parseInt(saved) : 0;
  });

  const [messages, setMessages] = useState([]);
  const [levelStartTime, setLevelStartTime] = useState(() => Date.now());
  const [manualLeaks, setManualLeaks] = useState([]);

  const addMessage = (sender, text, id = null) => {
    setMessages((prev) => {
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

  // REPORTING FUNCTION
  const reportScore = (userData, lvl, action = "UPDATE") => {
    const url = EVENT_CONFIG.googleScriptUrl;
    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      return;
    }

    const payload = {
      uid: userData.uid,
      name: userData.name,
      level: lvl,
      credits: userData.credits,
      action: action,
      device: navigator.userAgent,
    };

    fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => console.log("Report error:", err));
  };

  const login = (name) => {
    const uid = "AGT-" + Math.floor(Math.random() * 99999);
    const newUser = { name, uid, credits: 0 };
    setUser(newUser);
    localStorage.setItem("ph0enix_user", JSON.stringify(newUser));
    reportScore(newUser, 0, "LOGIN");
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
      setLevelStartTime(Date.now());

      localStorage.setItem("ph0enix_user", JSON.stringify(updatedUser));
      localStorage.setItem("ph0enix_level", nextLvl);

      addMessage(
        "System",
        `Level ${level.id} Cleared. +${level.reward} Credits.`,
      );
      reportScore(updatedUser, nextLvl, "SOLVED");

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
    reportScore(updatedUser, nextLvl, "SKIPPED");

    return { success: true, msg: "Skipping..." };
  };

  useEffect(() => {
    if (!user || currentLevelIndex >= LEVELS.length) return;

    const level = LEVELS[currentLevelIndex];
    const timer = setInterval(() => {
      const elapsed = (Date.now() - levelStartTime) / 1000;

      if (elapsed > level.hintDelay) {
        const hintId = `hint_${level.id}`;
        addMessage("Unknown", `[HINT]: ${level.hintText}`, hintId);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentLevelIndex, levelStartTime, user]);

  useEffect(() => {
    const url = EVENT_CONFIG.googleSheetCsvUrl;
    if (!user || !url || typeof url !== "string" || !url.startsWith("http"))
      return;

    const fetchLeaks = () => {
      Papa.parse(url, {
        download: true,
        header: true,
        complete: (results) => {
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

// --- CONFIGURATION ---
export const EVENT_CONFIG = {
  eventName: "Glitch Hunt 2026",
  ownerName: import.meta.env.VITE_OWNER_NAME || "CyberPh0enix",
  // SCOREBOARD (Write)
  googleScriptUrl: import.meta.env.VITE_GOOGLE_SCRIPT_URL,
  // LEAKS (Read)
  googleSheetCsvUrl: import.meta.env.VITE_GOOGLE_SHEET_CSV_URL,
};

export const RULEBOOK = `
# PH0ENIX PROTOCOL v4.0

1. **OBJECTIVE**: Breach Riverstone Corp.
2. **TOOLS**: Terminal, Browser, Messages.
3. **SCORING**: 
   - Win: +100 Credits
   - Skip: -250 Credits
4. **HINTS**: Auto-hints arrive if stuck > 3 mins.
`;

export const LEVELS = [
  {
    id: 0,
    title: "INITIATION",
    prompt: "The system ignores 'White Noise'. Highlight the anomaly.",
    type: "visual",
    // Plain: "WAKE_UP_NEO"
    answerHash:
      "8f683457591465a95383561a0529d38c127453d1004300e84b726084c0c1735d",
    hintDelay: 60,
    hintText: "Text is white on white background. Select/Highlight it.",
    reward: 50,
  },
  {
    id: 1,
    title: "SOURCE_LEAK",
    prompt: "A developer left a debug key in the DOM comments.",
    type: "html_comment",
    // Plain: "DEV_BACKDOOR_X7"
    answerHash:
      "d078170e55726df9425482e9d2179854df11079d375323984501a57f8623253b",
    hintDelay: 120,
    hintText: "Right Click -> Inspect Element. Search for <!-- comments -->",
    reward: 100,
  },
  {
    id: 2,
    title: "PACKET_SNIFFER",
    prompt: "Server rejecting connections. Check Network Response.",
    type: "browser",
    // Plain: "STATUS_418_TEAPOT"
    answerHash:
      "9781898555469905d4653f58a741364210a4e760086c52a093740e532b2e0436",
    hintDelay: 180,
    hintText:
      "Open Browser App. F12 -> Network Tab. Click Connect. Check the red request.",
    reward: 150,
  },
  {
    id: 3,
    title: "SUDO_FORCE",
    prompt: "Client-side privilege check detected.",
    type: "console",
    // Plain: "ROOT_ACCESS_GRANTED"
    answerHash:
      "0a830954707324c45e691238806371c668b55577609217621c107293a9712a32",
    hintDelay: 240,
    hintText: "Console (F12). Type: window.isAdmin = () => true",
    reward: 200,
  },
  {
    id: 4,
    title: "FINAL_TRANSMISSION",
    prompt: "Decrypt the Base64 signal.",
    type: "encoding",
    content: "U0VDUkVUX0FHRU5UX01BTg==",
    // Plain: "SECRET_AGENT_MAN"
    answerHash:
      "2204620570997193655383569426372134547285600649722883307730953187",
    hintDelay: 300,
    hintText: "Ends with ==. Use Base64 decoder.",
    reward: 300,
  },
];

export async function sha256(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

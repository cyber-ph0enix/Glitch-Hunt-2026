export const EVENT_CONFIG = {
  eventName: "Glitch Hunt 2026",
  ownerName: import.meta.env.VITE_OWNER_NAME || "CyberPh0enix",
  // SCOREBOARD (Write)
  googleScriptUrl: import.meta.env.VITE_GOOGLE_SCRIPT_URL,
  // LEAKS (Read)
  googleSheetCsvUrl: import.meta.env.VITE_GOOGLE_SHEET_CSV_URL,
};

export const LEVELS = [
  {
    id: 0,
    title: "INITIATION",
    prompt: "The system ignores 'White Noise'. Highlight the anomaly.",
    type: "visual",
    answerHash:
      "301655f566436402802058300266014457630737466540602410360340530504",
    hintDelay: 60,
    hintText: "Text is white on white background. Select/Highlight it.",
    reward: 50,
  },
  {
    id: 1,
    title: "SOURCE_LEAK",
    prompt: "A developer left a debug key in the DOM comments.",
    type: "html_comment",
    answerHash:
      "d078170e55726df9425482e9d2179854df11079d375323984501a57f8623253b",
    hintDelay: 120,
    hintText: "Right Click -> Inspect Element. Search for ",
    reward: 100,
  },
  {
    id: 2,
    title: "PACKET_SNIFFER",
    prompt: "Server rejecting connections. Check Network Response.",
    type: "browser",
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

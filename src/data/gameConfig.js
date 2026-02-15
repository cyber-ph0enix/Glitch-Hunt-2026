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
    prompt: "The system ignores '#FFFFFF Noise',check the anomaly.",
    type: "visual",
    answerHash:
      "072dbc00b45b903e843352f635b22a9fcdf62ebd1e1cf81ceb4a06d1b3a9a9b1",
    hintDelay: 60,
    hintText: "INFO: #FFFFFF has the key",
    reward: 50,
  },
  {
    id: 1,
    title: "SOURCE_LEAK",
    prompt: "A developer left a debug key in the DOM comments.",
    type: "html_comment",
    answerHash:
      "e35fe6a4a35f7dda8aa3e3ed640afae13f39c9985a8bc3322fbddc3d6726081f",
    hintDelay: 120,
    hintText: "INFO: /* LEAK */",
    reward: 100,
  },
  {
    id: 2,
    title: "PACKET_SNIFFER",
    prompt: "Server rejecting connections. Check Network Response.",
    type: "browser",
    answerHash:
      "600bb515ddce46daf023828a725c3dd5db29af7fddc1868884ccd83612e5130a",
    hintDelay: 180,
    hintText: "WebAPI: #FF0000 connect request.",
    reward: 150,
  },
  {
    id: 3,
    title: "SUDO_FORCE",
    prompt: "Client-side privilege check detected.",
    type: "console",
    answerHash:
      "ba3fbd5a789ac54e63446df86c0066cc516c0635a636ecd61301ee868e4b431b",
    hintDelay: 240,
    hintText: "c.log: window.isAdmin = () => false",
    reward: 200,
  },
  {
    id: 4,
    title: "FINAL_TRANSMISSION",
    prompt: "Decrypt the Base64 signal.",
    type: "encoding",
    content: "U0VDUkVUX0FHRU5UX01BTg==",
    answerHash:
      "8a44829db8bbd244e69119687d70c07f2465f2bf38edb259fc6c0bf92eacca2a",
    hintDelay: 300,
    hintText: "Ends with ==. Use Base64",
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

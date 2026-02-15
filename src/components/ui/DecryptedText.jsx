import React, { useState, useEffect } from "react";

const CHARS = "QM0ZK9#@&P$H";

export default function DecryptedText({ text, className }) {
  const [display, setDisplay] = useState("");
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(() =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(""),
      );
      if (iteration >= text.length) {
        clearInterval(interval);
        setFinished(true);
      }
      iteration += 1 / 2;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span
      className={`${className} ${finished ? "text-green-400" : "text-green-800"}`}
    >
      {display}
    </span>
  );
}

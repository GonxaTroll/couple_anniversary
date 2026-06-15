import { useEffect, useState } from "react";
import type { ChatMessage } from "../scenes/types";

type Props = {
  messages: ChatMessage[];
  onComplete: () => void;
};

export function ChatMessages({ messages, onComplete }: Props) {
  const [visible, setVisible] = useState<number>(0);

  useEffect(() => {
    setVisible(0);
  }, [messages]);

  useEffect(() => {
    if (visible >= messages.length) {
      onComplete();
      return;
    }
    const t = setTimeout(() => setVisible((v) => v + 1), 1800);
    return () => clearTimeout(t);
  }, [visible, messages.length, onComplete]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto px-6">
      {messages.slice(0, visible).map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.speaker === "her" ? "justify-end" : "justify-start"}`}
          style={{ animation: "fadeSlideIn 0.4s ease forwards" }}
        >
          <div
            className={`
              relative max-w-[72%] px-5 py-4 shadow-lg
              ${msg.speaker === "him"
                ? "rounded-2xl rounded-tl-sm border-l-4 border-amber-400/70"
                : "rounded-2xl rounded-tr-sm border-r-4 border-rose-400/70"
              }
            `}
            style={{
              background: "rgba(252, 249, 248, 0.92)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.45)",
            }}
          >
            <p
              className="text-stone-800 leading-snug mb-1"
              style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.15rem" }}
            >
              "{msg.text}"
            </p>
            <span
              className={`text-xs tracking-widest flex items-center gap-1 ${
                msg.speaker === "him" ? "text-amber-700" : "text-rose-700 justify-end"
              }`}
              style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
            >
              {msg.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

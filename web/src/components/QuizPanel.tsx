import { useState } from "react";
import type { Quiz } from "../scenes/types";

type Props = {
  quiz: Quiz;
  onAnswer: (optionId: string, optionText: string) => void;
};

export function QuizPanel({ quiz, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(id: string, text: string) {
    if (selected) return;
    setSelected(id);
    setTimeout(() => onAnswer(id, text), 600);
  }

  return (
    <div
      className="w-full max-w-xl mx-auto px-6 mt-4"
      style={{ animation: "fadeSlideIn 0.5s ease forwards" }}
    >
      <div
        className="rounded-2xl px-6 py-5 shadow-xl"
        style={{
          background: "rgba(252, 249, 248, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.5)",
        }}
      >
        <p
          className="text-stone-700 mb-4 text-center"
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "1.2rem",
            fontStyle: "italic",
          }}
        >
          {quiz.question}
        </p>
        <div className="flex flex-col gap-2">
          {quiz.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id, opt.text)}
              className={`
                w-full text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm
                ${
                  selected === opt.id
                    ? "bg-amber-500/80 text-white shadow-md scale-[1.02]"
                    : selected
                    ? "opacity-40 cursor-default bg-white/40"
                    : "bg-white/50 hover:bg-amber-100/70 hover:scale-[1.01] cursor-pointer"
                }
              `}
              style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

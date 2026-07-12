import { useState } from "react";

type DayOption = {
  id: string;
  label: string;
  day: string;
};

type Props = {
  options: DayOption[];
  correctId: string;
  onSelect: () => void;
};

export function DayPicker({ options, correctId, onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showError, setShowError] = useState(false);

  function handleSelect(id: string) {
    if (selected) return;

    if (id === correctId) {
      setSelected(id);
      setTimeout(() => onSelect(), 600);
    } else {
      setWrongAttempts((prev) => prev + 1);
      setShowError(true);
      setTimeout(() => setShowError(false), 800);
    }
  }

  const correctScale = 1 + wrongAttempts * 0.15;

  return (
    <div
      className="flex flex-col items-center gap-4"
      style={{ animation: "fadeSlideIn 0.6s ease forwards" }}
    >
      <p
        className="text-sm tracking-wider font-medium"
        style={{
          fontFamily: "'Be Vietnam Pro', sans-serif",
          color: "#1b1c1c",
          textShadow: "0 1px 2px rgba(255,255,255,0.3)",
        }}
      >
        ¿Qué día quedamos?
      </p>

      <div className="flex gap-4 items-end">
        {options.map((opt) => {
          const isCorrect = opt.id === correctId;
          const scale = isCorrect ? correctScale : 1;

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={!!selected}
              className="flex flex-col items-center gap-1 rounded-2xl transition-all cursor-pointer"
              style={{
                padding: "18px 24px",
                minWidth: "80px",
                background:
                  selected === opt.id
                    ? "linear-gradient(135deg, #d97d54, #c0694a)"
                    : "rgba(255, 255, 255, 0.85)",
                border:
                  selected === opt.id
                    ? "2px solid #d97d54"
                    : showError && !isCorrect
                      ? "2px solid #ba1a1a"
                      : "2px solid rgba(217, 125, 84, 0.3)",
                boxShadow:
                  selected === opt.id
                    ? "0 4px 20px rgba(217, 125, 84, 0.4)"
                    : showError && !isCorrect
                      ? "0 4px 16px rgba(186, 26, 26, 0.3)"
                      : "0 4px 16px rgba(0, 0, 0, 0.15)",
                backdropFilter: "blur(10px)",
                opacity: selected && selected !== opt.id ? 0.4 : 1,
                transform: `scale(${scale})`,
                zIndex: isCorrect ? 10 : 1,
                transition: "all 0.3s ease",
              }}
            >
              <span
                className="tracking-wider uppercase font-medium"
                style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: "11px",
                  color: selected === opt.id ? "rgba(255,255,255,0.8)" : "#8b7355",
                }}
              >
                {opt.label}
              </span>
              <span
                className="font-bold"
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "28px",
                  color: selected === opt.id ? "#fff" : "#1b1c1c",
                }}
              >
                {opt.day}
              </span>
            </button>
          );
        })}
      </div>

      {showError && (
        <p
          className="text-sm tracking-wide font-medium"
          style={{
            fontFamily: "'Be Vietnam Pro', sans-serif",
            color: "#ba1a1a",
            animation: "fadeSlideIn 0.3s ease",
            textShadow: "0 1px 2px rgba(255,255,255,0.3)",
          }}
        >
          Hmm, ese día no...
        </p>
      )}
    </div>
  );
}

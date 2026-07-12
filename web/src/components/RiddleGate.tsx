import { useCallback, useState } from "react";
import { DogFaceShiba, DogFacePuppy, DogFaceCorgi } from "./DogFaces";

type Props = {
  question: string;
  answer: string;
  onSolved: () => void;
};

export function RiddleGate({ question, answer, onSolved }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [solved, setSolved] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (value.trim().toLowerCase() === answer.toLowerCase()) {
        setSolved(true);
        setTimeout(onSolved, 700);
      } else {
        setError(true);
        setTimeout(() => setError(false), 1500);
      }
    },
    [value, answer, onSolved],
  );

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: "#fcf9f8",
        backgroundImage:
          "radial-gradient(circle at center, transparent 0%, rgba(217, 125, 84, 0.04) 100%)",
        opacity: solved ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
    >
      {/* Floating dog stickers */}
      <div className="absolute top-[6%] left-[5%] opacity-20 pointer-events-none riddle-float">
        <DogFaceShiba style={{ width: 80, height: 80 }} />
      </div>
      <div className="absolute top-[10%] left-[25%] opacity-10 pointer-events-none riddle-float-delayed">
        <DogFacePuppy style={{ width: 52, height: 52 }} />
      </div>
      <div className="absolute top-[4%] right-[12%] opacity-15 pointer-events-none riddle-float-slow">
        <DogFaceCorgi style={{ width: 68, height: 68 }} />
      </div>
      <div className="absolute top-[18%] right-[6%] opacity-[0.08] pointer-events-none riddle-float">
        <DogFaceShiba style={{ width: 56, height: 56 }} />
      </div>
      <div className="absolute top-[22%] left-[10%] opacity-12 pointer-events-none riddle-float-delayed2">
        <DogFaceCorgi style={{ width: 44, height: 44 }} />
      </div>
      <div className="absolute top-[35%] left-[3%] opacity-[0.07] pointer-events-none riddle-float-slow">
        <DogFacePuppy style={{ width: 90, height: 90 }} />
      </div>
      <div className="absolute top-[30%] right-[4%] opacity-[0.06] pointer-events-none riddle-float">
        <DogFaceShiba style={{ width: 48, height: 48 }} />
      </div>
      <div className="absolute bottom-[30%] left-[6%] opacity-15 pointer-events-none riddle-float-delayed">
        <DogFaceCorgi style={{ width: 72, height: 72 }} />
      </div>
      <div className="absolute bottom-[18%] left-[20%] opacity-[0.08] pointer-events-none riddle-float-slow">
        <DogFacePuppy style={{ width: 60, height: 60 }} />
      </div>
      <div className="absolute bottom-[10%] right-[8%] opacity-18 pointer-events-none riddle-float">
        <DogFaceShiba style={{ width: 96, height: 96 }} />
      </div>
      <div className="absolute bottom-[8%] right-[28%] opacity-[0.06] pointer-events-none riddle-float-delayed2">
        <DogFaceCorgi style={{ width: 50, height: 50 }} />
      </div>
      <div className="absolute bottom-[35%] right-[12%] opacity-10 pointer-events-none riddle-float-delayed">
        <DogFacePuppy style={{ width: 40, height: 40 }} />
      </div>
      <div className="absolute top-[48%] left-[8%] opacity-[0.05] pointer-events-none riddle-float">
        <DogFaceShiba style={{ width: 36, height: 36 }} />
      </div>
      <div className="absolute top-[55%] right-[7%] opacity-[0.07] pointer-events-none riddle-float-slow">
        <DogFaceCorgi style={{ width: 42, height: 42 }} />
      </div>

      {/* Main card */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className="w-full max-w-lg mx-6 rounded-2xl px-8 py-10 flex flex-col items-center text-center"
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            boxShadow:
              "0 8px 32px rgba(217, 125, 84, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
            animation: "fadeSlideIn 0.6s ease forwards",
          }}
        >
          {/* Heart icon */}
          <div className="mb-4" style={{ color: "#b19056" }}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          {/* Question */}
          <h1
            className="mb-2"
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "1.6rem",
              fontWeight: 500,
              lineHeight: 1.3,
              color: "#1b1c1c",
            }}
          >
            {question}
          </h1>

          <p
            className="mb-8"
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: "0.85rem",
              color: "#55433c",
              letterSpacing: "0.03em",
            }}
          >
            Desbloquea tus recuerdos para continuar.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xs flex flex-col items-center"
          >
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(false);
              }}
              placeholder="Ingresa la respuesta..."
              autoComplete="off"
              className="w-full text-center py-3 px-2 outline-none"
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: "1rem",
                background: "transparent",
                border: "none",
                borderBottom: error
                  ? "1.5px solid #ba1a1a"
                  : "1.5px solid #dac1b8",
                color: "#1b1c1c",
                transition: "border-color 0.3s ease",
              }}
            />

            {error && (
              <p
                className="mt-3"
                style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: "0.75rem",
                  color: "#ba1a1a",
                  animation: "fadeSlideIn 0.3s ease",
                }}
              >
                Eso no es del todo correcto...
              </p>
            )}

            <button
              type="submit"
              className="mt-8 w-full py-3 rounded-full text-sm tracking-widest flex items-center justify-center gap-2 cursor-pointer"
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontWeight: 500,
                fontSize: "0.85rem",
                background: "#d97d54",
                border: "none",
                color: "#fff",
                transition: "all 0.3s ease",
                letterSpacing: "0.05em",
                boxShadow: "0 2px 8px rgba(217, 125, 84, 0.25)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
              Desbloquear Diario
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

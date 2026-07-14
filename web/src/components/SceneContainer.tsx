import { useCallback, useEffect, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { HomeScene } from "@couple/video";
import { MuVimScene } from "@couple/video";
import { HomeBothScene } from "@couple/video";
import type { ChatMessage, Scene } from "../scenes/types";
import { QuizPanel } from "./QuizPanel";
import { DayPicker } from "./DayPicker";

const COMPOSITION_MAP = {
  HomeScene,
  MuVimScene,
  HomeBothScene,
} as const;

type Props = {
  scene: Scene;
  onNext: () => void;
  onReset: () => void;
  isLast: boolean;
};

export function SceneContainer({ scene, onNext, onReset, isLast }: Props) {
  const [displayedMessages, setDisplayedMessages] = useState<ChatMessage[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<"messages" | "quiz" | "postMessages" | "dayPicker" | "postDayMessages" | "done" | "wrongEnd">("messages");
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const playerRef = useRef<PlayerRef>(null);

  const selectedOption = scene.quiz?.options.find(opt => opt.id === selectedQuizOption);
  const isCorrectAnswer = selectedOption?.isCorrect === true;

  // Initialize with scene messages
  useEffect(() => {
    setDisplayedMessages([...scene.messages]);
    setVisibleCount(0);
    setPhase(scene.messages.length > 0 ? "messages" : (scene.quiz ? "quiz" : "done"));
    setSelectedQuizOption(null);
    setTransitioning(false);
    playerRef.current?.seekTo(0);
  }, [scene.id, scene.messages, scene.quiz]);

  // Show messages one by one
  useEffect(() => {
    if (phase !== "messages" && phase !== "postMessages" && phase !== "postDayMessages") return;
    if (visibleCount >= displayedMessages.length) return;

    const t = setTimeout(() => setVisibleCount(v => v + 1), 1800);
    return () => clearTimeout(t);
  }, [visibleCount, displayedMessages.length, phase]);

  // When initial messages are done showing
  useEffect(() => {
    if (phase === "messages" && visibleCount >= displayedMessages.length && displayedMessages.length > 0) {
      if (scene.quiz) {
        setPhase("quiz");
      } else {
        setPhase("done");
      }
    }
  }, [phase, visibleCount, displayedMessages.length, scene.quiz]);

  // When post-quiz messages are done showing
  useEffect(() => {
    if (phase === "postMessages" && visibleCount >= displayedMessages.length && displayedMessages.length > 0) {
      if (isCorrectAnswer && scene.dayPicker) {
        setPhase("dayPicker");
      } else if (isCorrectAnswer) {
        setPhase("done");
      } else {
        setPhase("wrongEnd");
      }
    }
  }, [phase, visibleCount, displayedMessages.length, scene.dayPicker, isCorrectAnswer]);

  // When post-day-picker messages are done showing
  useEffect(() => {
    if (phase === "postDayMessages" && visibleCount >= displayedMessages.length && displayedMessages.length > 0) {
      setPhase("done");
    }
  }, [phase, visibleCount, displayedMessages.length]);

  const handleQuizAnswer = useCallback((optionId: string) => {
    setSelectedQuizOption(optionId);
    const opt = scene.quiz?.options.find(o => o.id === optionId);
    const msgs = opt?.nextMessages || [];
    const correct = opt?.isCorrect === true;
    if (msgs.length > 0) {
      setDisplayedMessages(prev => [...prev, ...msgs]);
      setVisibleCount(prev => prev);
      setPhase("postMessages");
    } else if (correct) {
      setPhase("done");
    } else {
      setPhase("wrongEnd");
    }
  }, [scene.quiz]);

  const handleDayPickerSelect = useCallback(() => {
    const msgs = scene.postDayPickerMessages || [];
    if (msgs.length > 0) {
      setDisplayedMessages(prev => [...prev, ...msgs]);
      setVisibleCount(prev => prev);
      setPhase("postDayMessages");
    } else {
      setPhase("done");
    }
  }, [scene.postDayPickerMessages]);

  const handleAdvance = useCallback(async () => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => onNext(), 400);
  }, [transitioning, onNext]);

  const Component = COMPOSITION_MAP[scene.compositionId];
  const hasMessages = scene.messages.length > 0;
  const allMessagesShown = visibleCount >= displayedMessages.length;
  const readyForTransition = phase === "done" && allMessagesShown;

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        opacity: transitioning ? 0 : 1,
        transition: "opacity 0.8s ease",
      }}
    >
      {/* Remotion animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: "max(100vw, calc(100vh * 1584 / 672))",
            minHeight: "max(100vh, calc(100vw * 672 / 1584))",
            width: "max(100vw, calc(100vh * 1584 / 672))",
            height: "max(100vh, calc(100vw * 672 / 1584))",
          }}
        >
          <Player
            ref={playerRef}
            component={Component}
            durationInFrames={60 * 30}
            fps={60}
            compositionWidth={1584}
            compositionHeight={672}
            style={{ width: "100%", height: "100%" }}
            autoPlay
            loop
            controls={false}
            clickToPlay={false}
            spaceKeyToPlayOrPause={false}
            moveToBeginningWhenEnded={false}
            inputProps={{
              imageSrc: `${
                import.meta.env.BASE_URL
              }${
                scene.compositionId === "HomeScene" ? "final_home.png"
                  : scene.compositionId === "HomeBothScene" ? "final_home_both.png"
                  : "final_muvim.png"
              }`,
            }}
          />
        </div>
      </div>

      {/* Story overlay */}
      {hasMessages && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center py-12 overflow-y-auto">
          {/* All accumulated messages - always visible */}
          <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto px-6">
            {displayedMessages.slice(0, visibleCount).map((msg) => (
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

          {/* Quiz */}
          {phase === "quiz" && allMessagesShown && (
            <QuizPanel
              quiz={scene.quiz!}
              onAnswer={(id) => handleQuizAnswer(id)}
            />
          )}

          {/* Day picker */}
          {phase === "dayPicker" && allMessagesShown && scene.dayPicker && (
            <DayPicker
              options={scene.dayPicker.options}
              correctId={scene.dayPicker.correctId}
              onSelect={handleDayPickerSelect}
            />
          )}

          {/* Continue button */}
          {readyForTransition && scene.transition.type === "button" && (
            <button
              onClick={() => handleAdvance()}
              className="mt-6 px-8 py-3 rounded-full text-white text-sm tracking-widest transition-all hover:scale-105 active:scale-95"
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                background: "rgba(150, 72, 36, 0.85)",
                backdropFilter: "blur(8px)",
              }}
            >
              {scene.transition.label}
            </button>
          )}

          {/* Wrong answer - go back to login */}
          {phase === "wrongEnd" && allMessagesShown && (
            <button
              onClick={() => onReset()}
              className="mt-6 px-8 py-3 rounded-full text-white text-sm tracking-widest transition-all hover:scale-105 active:scale-95"
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                background: "rgba(186, 26, 26, 0.85)",
                backdropFilter: "blur(8px)",
              }}
            >
              Volver al inicio
            </button>
          )}

          {/* End marker */}
          {isLast && readyForTransition && (
            <p
              className="mt-8 text-white/60 text-sm tracking-widest"
              style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
            >
              — fin —
            </p>
          )}
        </div>
      )}

      {/* Simple continue button for scenes without messages */}
      {!hasMessages && scene.transition.type === "button" && (
        <div className="absolute inset-0 z-10 flex items-end justify-center pb-16">
          <button
            onClick={() => handleAdvance()}
            className="px-8 py-3 rounded-full text-white text-sm tracking-widest transition-all hover:scale-105 active:scale-95"
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              background: "rgba(150, 72, 36, 0.85)",
              backdropFilter: "blur(8px)",
            }}
          >
            {scene.transition.label}
          </button>
        </div>
      )}
    </div>
  );
}

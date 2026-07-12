import { useCallback, useEffect, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { HomeScene } from "@couple/video";
import { MuVimScene } from "@couple/video";
import type { Scene } from "../scenes/types";
import { ChatMessages } from "./ChatMessages";
import { QuizPanel } from "./QuizPanel";
import { DayPicker } from "./DayPicker";

const COMPOSITION_MAP = {
  HomeScene,
  MuVimScene,
} as const;

type Props = {
  scene: Scene;
  onNext: () => void;
  isLast: boolean;
};

export function SceneContainer({ scene, onNext, isLast }: Props) {
  const [messagesComplete, setMessagesComplete] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [postMessagesComplete, setPostMessagesComplete] = useState(false);
  const [dayPickerComplete, setDayPickerComplete] = useState(false);
  const [postDayPickerComplete, setPostDayPickerComplete] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const playerRef = useRef<PlayerRef>(null);

  // Reset on scene change
  useEffect(() => {
    setMessagesComplete(false);
    setQuizComplete(false);
    setPostMessagesComplete(false);
    setDayPickerComplete(false);
    setPostDayPickerComplete(false);
    setTransitioning(false);
    playerRef.current?.seekTo(0);
  }, [scene.id]);

  // Auto-complete if no messages
  useEffect(() => {
    if (scene.messages.length === 0) {
      setMessagesComplete(true);
    }
  }, [scene.messages.length]);

  // Auto-complete if no post-quiz messages
  useEffect(() => {
    if (!scene.postQuizMessages || scene.postQuizMessages.length === 0) {
      setPostMessagesComplete(true);
    }
  }, [scene.postQuizMessages]);

  // Auto-complete if no day picker
  useEffect(() => {
    if (!scene.dayPicker) {
      setDayPickerComplete(true);
    }
  }, [scene.dayPicker]);

  // Auto-complete if no post-day-picker messages
  useEffect(() => {
    if (!scene.postDayPickerMessages || scene.postDayPickerMessages.length === 0) {
      setPostDayPickerComplete(true);
    }
  }, [scene.postDayPickerMessages]);

  const handleMessagesComplete = useCallback(() => {
    setMessagesComplete(true);
  }, []);

  const handlePostMessagesComplete = useCallback(() => {
    setPostMessagesComplete(true);
  }, []);

  const handlePostDayPickerComplete = useCallback(() => {
    setPostDayPickerComplete(true);
  }, []);

  const handleAdvance = useCallback(async () => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => onNext(), 400);
  }, [transitioning, onNext]);

  const Component = COMPOSITION_MAP[scene.compositionId];
  const hasMessages = scene.messages.length > 0;

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        opacity: transitioning ? 0 : 1,
        transition: "opacity 0.8s ease",
      }}
    >
      {/* Remotion animation — full-bleed background */}
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
                scene.compositionId === "HomeScene" ? "final_home.png" : "final_muvim.png"
              }`,
            }}
          />
        </div>
      </div>

      {/* Story overlay — only for scenes with messages */}
      {hasMessages && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center py-12 overflow-y-auto">
          <ChatMessages
            messages={scene.messages}
            onComplete={handleMessagesComplete}
          />

          {messagesComplete && scene.quiz && !quizComplete && (
            <QuizPanel
              quiz={scene.quiz}
              onAnswer={() => setQuizComplete(true)}
            />
          )}

          {quizComplete && scene.postQuizMessages && scene.postQuizMessages.length > 0 && (
            <ChatMessages
              messages={scene.postQuizMessages}
              onComplete={handlePostMessagesComplete}
            />
          )}

          {postMessagesComplete && scene.dayPicker && !dayPickerComplete && (
            <DayPicker
              options={scene.dayPicker.options}
              correctId={scene.dayPicker.correctId}
              onSelect={() => setDayPickerComplete(true)}
            />
          )}

          {dayPickerComplete && scene.postDayPickerMessages && scene.postDayPickerMessages.length > 0 && (
            <ChatMessages
              messages={scene.postDayPickerMessages}
              onComplete={handlePostDayPickerComplete}
            />
          )}

          {((!scene.quiz && messagesComplete) || (scene.quiz && quizComplete && postMessagesComplete && dayPickerComplete && postDayPickerComplete)) && scene.transition.type === "button" && (
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

          {isLast && ((!scene.quiz && messagesComplete) || (scene.quiz && quizComplete && postMessagesComplete && dayPickerComplete && postDayPickerComplete)) && (
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
      {!hasMessages && messagesComplete && scene.transition.type === "button" && (
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

import { useCallback, useEffect, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { HomeScene } from "@couple/video";
import { MuVimScene } from "@couple/video";
import type { Scene } from "../scenes/types";
import { ChatMessages } from "./ChatMessages";
import { QuizPanel } from "./QuizPanel";
import { submitQuizAnswer } from "../api/quiz";

// Hardcoded for now — swap once backend auth/session exists
const ANNIVERSARY_ID = 1;
const PERSON = "person_1"; // TODO: determine from session

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
  const [transitioning, setTransitioning] = useState(false);
  const playerRef = useRef<PlayerRef>(null);

  // Reset on scene change
  useEffect(() => {
    setMessagesComplete(false);
    setTransitioning(false);
    playerRef.current?.seekTo(0);
  }, [scene.id]);

  const handleAdvance = useCallback(async (answerId?: string, answerText?: string) => {
    if (transitioning) return;
    setTransitioning(true);

    if (scene.quiz && answerId && answerText) {
      // Fire and forget — don't block the transition
      submitQuizAnswer({
        anniversary_id: ANNIVERSARY_ID,
        person: PERSON,
        question_key: scene.quiz.questionKey,
        answer_text: answerText,
      }).catch(console.error);
    }

    // Small delay so the user sees their selection highlighted
    setTimeout(() => onNext(), 400);
  }, [transitioning, scene.quiz, onNext]);

  const Component = COMPOSITION_MAP[scene.compositionId];

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        opacity: transitioning ? 0 : 1,
        transition: "opacity 0.8s ease",
      }}
    >
      {/* Remotion animation — full-bleed background */}
      <div className="absolute inset-0 z-0">
        <Player
          ref={playerRef}
          component={Component}
          durationInFrames={60 * 30}
          fps={60}
          compositionWidth={2560}
          compositionHeight={1440}
          style={{ width: "100%", height: "100%" }}
          autoPlayback
          loop
          controls={false}
          clickToPlay={false}
          spaceKeyToPlayOrPause={false}
          moveToBeginningWhenEnded={false}
          inputProps={{}}
        />
      </div>

      {/* Story overlay — centred column */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center py-12 overflow-y-auto">
        <ChatMessages
          messages={scene.messages}
          onComplete={() => setMessagesComplete(true)}
        />

        {messagesComplete && scene.quiz && (
          <QuizPanel
            quiz={scene.quiz}
            onAnswer={(id, text) => handleAdvance(id, text)}
          />
        )}

        {messagesComplete && !scene.quiz && scene.transition.type === "button" && (
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

        {isLast && messagesComplete && !scene.quiz && (
          <p
            className="mt-8 text-white/60 text-sm tracking-widest"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
          >
            — fin —
          </p>
        )}
      </div>
    </div>
  );
}

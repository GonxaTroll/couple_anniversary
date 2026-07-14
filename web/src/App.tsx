import { useCallback, useState } from "react";
import { SceneContainer } from "./components/SceneContainer";
import { RiddleGate } from "./components/RiddleGate";
import { SCENES, RIDDLE } from "./scenes/data";
import "./index.css";

export default function App() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const [storyUnlocked, setStoryUnlocked] = useState(false);

  const handleNext = useCallback(() => {
    if (sceneIndex >= SCENES.length - 1) return;
    setFadingOut(true);
    setTimeout(() => {
      setSceneIndex((i) => i + 1);
      setFadingOut(false);
    }, 800);
  }, [sceneIndex]);

  const handleReset = useCallback(() => {
    setFadingOut(true);
    setTimeout(() => {
      setSceneIndex(0);
      setStoryUnlocked(false);
      setFadingOut(false);
    }, 800);
  }, []);

  if (!storyUnlocked) {
    return (
      <div className="w-screen full-height overflow-hidden">
        <RiddleGate
          question={RIDDLE.question}
          answer={RIDDLE.answer}
          onSolved={() => setStoryUnlocked(true)}
        />
      </div>
    );
  }

  return (
    <div
      className="w-screen full-height overflow-hidden bg-black"
      style={{
        opacity: fadingOut ? 0 : 1,
        transition: "opacity 0.8s ease",
      }}
    >
      <SceneContainer
        key={SCENES[sceneIndex].id}
        scene={SCENES[sceneIndex]}
        onNext={handleNext}
        onReset={handleReset}
        isLast={sceneIndex === SCENES.length - 1}
      />
    </div>
  );
}

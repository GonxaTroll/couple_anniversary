import { useCallback, useState } from "react";
import { SceneContainer } from "./components/SceneContainer";
import { SCENES } from "./scenes/data";
import "./index.css";

export default function App() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  const handleNext = useCallback(() => {
    if (sceneIndex >= SCENES.length - 1) return;
    setFadingOut(true);
    setTimeout(() => {
      setSceneIndex((i) => i + 1);
      setFadingOut(false);
    }, 800);
  }, [sceneIndex]);

  return (
    <div
      className="w-screen h-screen overflow-hidden bg-black"
      style={{
        opacity: fadingOut ? 0 : 1,
        transition: "opacity 0.8s ease",
      }}
    >
      <SceneContainer
        key={SCENES[sceneIndex].id}
        scene={SCENES[sceneIndex]}
        onNext={handleNext}
        isLast={sceneIndex === SCENES.length - 1}
      />
    </div>
  );
}

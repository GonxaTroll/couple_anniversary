import "./index.css";
import { Composition } from "remotion";
import { HomeScene } from "./HomeScene";
import { MuVimScene } from "./MuVimScene";
import { HomeBothScene } from "./HomeBothScene";
import { TripsScene } from "./TripsScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HomeScene"
        component={HomeScene}
        durationInFrames={60 * 30} // 30 s loop (player will loop it)
        fps={60}
        width={1584}
        height={672}
      />
      <Composition
        id="MuVimScene"
        component={MuVimScene}
        durationInFrames={60 * 30}
        fps={60}
        width={1584}
        height={672}
      />
      <Composition
        id="HomeBothScene"
        component={HomeBothScene}
        durationInFrames={60 * 30}
        fps={60}
        width={1584}
        height={672}
      />
      <Composition
        id="TripsScene"
        component={TripsScene}
        durationInFrames={60 * 30}
        fps={60}
        width={1584}
        height={672}
      />
    </>
  );
};

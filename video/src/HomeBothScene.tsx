import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Props = {
  imageSrc?: string;
};

export const HomeBothScene: React.FC<Props> = ({
  imageSrc = "/final_home_both.png",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sceneOpacity = interpolate(
    frame,
    [durationInFrames - 60, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const letterboxH = interpolate(
    frame,
    [0, 30, durationInFrames - 30, durationInFrames],
    [0, 36, 36, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const breathe = Math.sin((frame / fps) * (Math.PI / 2)) * 0.008 + 1;
  const drift = Math.sin((frame / fps) * 0.4) * 6;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#1a1008",
        opacity: sceneOpacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${breathe})`,
          transformOrigin: "center center",
          willChange: "transform",
          overflow: "hidden",
        }}
      >
        <Img
          src={imageSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `calc(50% + ${drift}px) 50%`,
          }}
        />
      </div>

      {/* Warm ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(255,180,100,0.08) 0%, transparent 70%)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* Letterbox bars */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: letterboxH,
          background: "#000",
          transition: "height 0.1s",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: letterboxH,
          background: "#000",
          transition: "height 0.1s",
        }}
      />
    </AbsoluteFill>
  );
};

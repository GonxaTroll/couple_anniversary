import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Props = {
  images?: string[];
};

const IMAGES = [
  "/final_albufera.png",
  "/final_budapest.png",
  "/final_horchata.png",
];

const TEXTS = [
  "Y como esta, muchas han sido las experiencias juntos",
  "1 año compartido. Diferentes estaciones, diferentes emociones",
  "Por muchas más. Te quiero",
];

export const TripsScene: React.FC<Props> = ({ images = IMAGES }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sceneOpacity = interpolate(
    frame,
    [0, 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const letterboxH = interpolate(
    frame,
    [0, 30, durationInFrames - 30, durationInFrames],
    [0, 36, 36, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const breathe = Math.sin((frame / fps) * (Math.PI / 2)) * 0.006 + 1;
  const drift = Math.sin((frame / fps) * 0.3) * 5;

  // Split total frames evenly across images with crossfade overlap
  const overlap = 90;
  const segmentLen = durationInFrames / images.length;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#1a1008",
        opacity: sceneOpacity,
      }}
    >
      {images.map((src, i) => {
        const start = i * segmentLen;
        const end = start + segmentLen;

        let opacity: number;
        if (i === images.length - 1) {
          // Last image: fade in and stay visible
          opacity = interpolate(
            frame,
            [start, start + 20],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
        } else {
          // Other images: fade in at start, hold, fade out before next image
          opacity = interpolate(
            frame,
            [start, start + 20, end - overlap, end],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
        }

        return (
          <div
            key={src}
            style={{
              position: "absolute",
              inset: 0,
              opacity,
              transform: `scale(${breathe})`,
              transformOrigin: "center center",
              willChange: "transform",
              overflow: "hidden",
            }}
          >
            <Img
              src={src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: `calc(50% + ${drift}px) 50%`,
              }}
            />
            {/* Text overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: 80,
                background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)",
              }}
            >
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 38,
                  fontStyle: "italic",
                  color: "#fff",
                  textAlign: "center",
                  maxWidth: "75%",
                  lineHeight: 1.4,
                  textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                  opacity: interpolate(
                    frame,
                    [start + 30, start + 50],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  ),
                }}
              >
                {TEXTS[i]}
              </p>
            </div>
          </div>
        );
      })}

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
        }}
      />
    </AbsoluteFill>
  );
};

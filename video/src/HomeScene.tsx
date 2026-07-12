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

// ─── Deterministic pseudo-random helpers ────────────────────────────────────

/** Seeded hash: returns a stable float in [0,1) for any integer seed */
const hash = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ─── Particle type ───────────────────────────────────────────────────────────

type DustMote = {
  id: number;
  /** normalised 0-1 start X position */
  x0: number;
  /** normalised 0-1 start Y position */
  y0: number;
  /** drift speed in pixels/frame */
  driftX: number;
  driftY: number;
  /** base opacity */
  opacity: number;
  /** twinkle frequency (rad/frame) */
  twinkleFreq: number;
  /** twinkle phase offset */
  twinklePhase: number;
  /** diameter in px */
  size: number;
};

const NUM_DUST = 28;

/** Generate all dust motes once — deterministic */
const DUST_MOTES: DustMote[] = Array.from({ length: NUM_DUST }, (_, i) => ({
  id: i,
  x0: hash(i * 3 + 0),
  y0: hash(i * 3 + 1),
  driftX: (hash(i * 7 + 2) - 0.5) * 0.12,   // ±0.06 px/frame
  driftY: -(hash(i * 7 + 3) * 0.08 + 0.02),  // gentle upward float
  opacity: hash(i * 5 + 4) * 0.45 + 0.1,
  twinkleFreq: hash(i * 11 + 5) * 0.04 + 0.01,
  twinklePhase: hash(i * 13 + 6) * Math.PI * 2,
  size: hash(i * 17 + 7) * 3 + 1.5,
}));

/**
 * HomeScene — him on couch, her at desk.
 * Ambient effects:
 *   - Intro: spring-powered fade+slide (frames 0–45)
 *   - Outro: fade-out (frames 1740–1800)
 *   - Parallax: foreground layer drifts more than background
 *   - Slow whole-image breathe (scale oscillation)
 *   - Warm lamp flicker (orange overlay, her side)
 *   - Phone screen glow pulse (his side)
 *   - Subtle camera drift (translateX)
 *   - Dust motes floating in lamplight

 *   - Cinematic letterbox bars slide in on intro
 */
export const HomeScene: React.FC<Props> = ({
  imageSrc = "/final_home.png",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── Intro / Outro ──────────────────────────────────────────────────────────

  const sceneOpacity = interpolate(
    frame,
    [durationInFrames - 60, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Letterbox bars (slide in over first 45 frames, stay through outro)
  const letterboxH = interpolate(
    frame,
    [0, 30, durationInFrames - 30, durationInFrames],
    [0, 36, 36, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Ambient motion ─────────────────────────────────────────────────────────

  // Slow breathing — one full inhale/exhale every ~4 s
  const breathe = Math.sin((frame / fps) * (Math.PI / 2)) * 0.008 + 1;

  // Very slow camera drift left↔right
  const drift = Math.sin((frame / fps) * 0.4) * 6;

  // Parallax: image shifts its object-position anchor with the drift.
  const parallaxOffsetPx = drift;

  // ── Overlays ───────────────────────────────────────────────────────────────

  // Lamp flicker — her side (right half). Low-freq + high-freq noise
  const lampFlicker =
    0.06 *
    (Math.sin((frame / fps) * 3.7) * 0.5 +
      Math.sin((frame / fps) * 11.3) * 0.3 +
      Math.sin((frame / fps) * 23.1) * 0.2);

  // Phone glow — his side (left half). Slow pulse
  const phoneGlow = (Math.sin((frame / fps) * 1.2) + 1) / 2;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#1a1008",
        opacity: sceneOpacity,
      }}
    >
      {/* ── Base illustration — single image load, parallax via object-position ── */}
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
            // Shift the image crop anchor: parallax depth without duplicate load.
            // 50% is the neutral center; we offset by parallaxOffsetPx converted
            // to a percentage of the composition width (1584 px).
            objectPosition: `calc(50% + ${parallaxOffsetPx}px) 50%`,
          }}
        />
      </div>

      {/* ── Lamp flicker overlay — right half only ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          background: `radial-gradient(ellipse at 70% 20%, rgba(255,210,120,${
            0.08 + lampFlicker
          }) 0%, transparent 60%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* ── Phone glow — left half ── */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "5%",
          width: "45%",
          height: "60%",
          background: `radial-gradient(ellipse at 60% 35%, rgba(180,210,255,${
            phoneGlow * 0.07
          }) 0%, transparent 55%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* ── Dust motes ── */}
      {DUST_MOTES.map((m) => {
        // wrap position so motes loop seamlessly
        const totalFrames = durationInFrames;
        const rawX = m.x0 + (m.driftX * frame) / totalFrames;
        const rawY = m.y0 + (m.driftY * frame) / totalFrames;
        const x = ((rawX % 1) + 1) % 1;
        const y = ((rawY % 1) + 1) % 1;
        const twinkle =
          Math.sin(frame * m.twinkleFreq + m.twinklePhase) * 0.35 + 0.65;
        const alpha = m.opacity * twinkle;

        return (
          <div
            key={m.id}
            style={{
              position: "absolute",
              left: `${x * 100}%`,
              top: `${y * 100}%`,
              width: m.size,
              height: m.size,
              borderRadius: "50%",
              background: `rgba(255, 220, 160, ${alpha})`,
              boxShadow: `0 0 ${m.size * 2}px rgba(255,200,100,${alpha * 0.6})`,
              pointerEvents: "none",
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}

      {/* ── Vignette for depth ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Cinematic letterbox ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: letterboxH,
          background: "#000",
          pointerEvents: "none",
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
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

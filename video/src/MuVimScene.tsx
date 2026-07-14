import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
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

// ─── Firefly type ────────────────────────────────────────────────────────────

type Firefly = {
  id: number;
  /** normalised 0-1 start X */
  x0: number;
  /** normalised 0-1 start Y */
  y0: number;
  /** drift — slow wandering in X (normalised/frame) */
  vx: number;
  /** drift — slow wandering in Y (normalised/frame) */
  vy: number;
  /** secondary wobble amplitude in normalised units */
  wobbleAmp: number;
  /** wobble frequency (rad/frame) */
  wobbleFreq: number;
  /** wobble phase */
  wobblePhase: number;
  /** blink frequency (rad/frame) — slow */
  blinkFreq: number;
  /** blink phase offset */
  blinkPhase: number;
  /** peak opacity when fully lit */
  peakOpacity: number;
  /** glow size in px */
  size: number;
};

const NUM_FIREFLIES = 22;

const FIREFLIES: Firefly[] = Array.from({ length: NUM_FIREFLIES }, (_, i) => ({
  id: i,
  x0: hash(i * 3 + 0),
  y0: hash(i * 3 + 1) * 0.7 + 0.1,        // keep them in the middle band
  vx: (hash(i * 7 + 2) - 0.5) * 0.00012,  // very slow horizontal drift
  vy: (hash(i * 7 + 3) - 0.5) * 0.00008,  // very slow vertical drift
  wobbleAmp: hash(i * 11 + 4) * 0.012 + 0.004,
  wobbleFreq: hash(i * 13 + 5) * 0.018 + 0.006,
  wobblePhase: hash(i * 17 + 6) * Math.PI * 2,
  blinkFreq: hash(i * 19 + 7) * 0.022 + 0.008, // ~0.008–0.03 rad/frame → slow blink
  blinkPhase: hash(i * 23 + 8) * Math.PI * 2,
  peakOpacity: hash(i * 29 + 9) * 0.6 + 0.3,
  size: hash(i * 31 + 10) * 5 + 3,
}));

// ─── Bokeh circle type ───────────────────────────────────────────────────────

type BokehCircle = {
  id: number;
  x: number;
  y: number;
  /** drift velocity in normalised/frame */
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulseFreq: number;
  pulsePhase: number;
  /** pink or blue */
  color: string;
};

const NUM_BOKEH = 14;

const BOKEH: BokehCircle[] = Array.from({ length: NUM_BOKEH }, (_, i) => ({
  id: i,
  x: hash(i * 3 + 10),
  y: hash(i * 3 + 11),
  vx: (hash(i * 7 + 12) - 0.5) * 0.00035,
  vy: (hash(i * 7 + 13) - 0.5) * 0.00025,
  size: hash(i * 11 + 14) * 28 + 10,
  opacity: hash(i * 5 + 15) * 0.18 + 0.04,
  pulseFreq: hash(i * 13 + 16) * 0.025 + 0.008,
  pulsePhase: hash(i * 17 + 17) * Math.PI * 2,
  color:
    hash(i * 19 + 18) > 0.5
      ? `rgba(255,80,200,__A__)`
      : `rgba(140,80,255,__A__)`,
}));

/**
 * MuVimScene — him standing outside at night, neon MuViM sign.
 * Ambient effects:
 *   - Intro: spring-powered fade+slide (frames 0–45)
 *   - Outro: fade-out (frames 1740–1800)
 *   - Parallax: foreground moves at full drift, background at 35%
 *   - Walking sway: whole-image gentle rock side-to-side (simulates gait)
 *   - Vertical bob: slight up/down on a walk cycle cadence
 *   - Neon sign pulse: deterministic colour-shift glow (Math.random removed)
 *   - Neon power surge: burst every ~8 s
 *   - Night ambient light shift: cool blue hue breathes in/out
 *   - Subtle motion blur via CSS filter during sway peaks
 *   - Fireflies drifting and blinking across the scene *   - Bokeh circles drifting near neon light
 *   - Cinematic letterbox bars
 */
export const MuVimScene: React.FC<Props> = ({
  imageSrc = "/final_muvim.png",
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

  // Letterbox
  const letterboxH = interpolate(
    frame,
    [0, 30, durationInFrames - 30, durationInFrames],
    [0, 36, 36, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Walk cycle ─────────────────────────────────────────────────────────────

  const walkCycle = (frame / fps) * 2 * Math.PI * 0.9;

  const sway = Math.sin(walkCycle) * 4;
  const bob = Math.abs(Math.sin(walkCycle)) * -3;
  const lean = Math.sin(walkCycle) * 0.4;

  // Walk motion applied via transform; no duplicate image load needed.
  // Motion blur peaks at mid-sway
  const blurAmount = Math.abs(Math.sin(walkCycle)) * 0.6;

  // ── Neon — deterministic, no Math.random() ─────────────────────────────────

  const neonBase = (Math.sin((frame / fps) * 1.5) + 1) / 2;

  // Deterministic "flicker" — two incoherent high-frequency sines + rare phase spike
  const neonFlicker =
    0.15 *
    (Math.sin((frame / fps) * 17.3) * 0.5 +
      Math.sin((frame / fps) * 31.7) * 0.3 +
      // Rare power dropout: fires ~2% of frames (hash of frame index, stable)
      (hash(frame * 73) < 0.02 ? -0.4 : 0));

  // Power surge: every ~8 s, a bright burst over 12 frames
  const surgePeriodFrames = Math.round(fps * 8);
  const surgePhase = frame % surgePeriodFrames;
  const surgeProgress = spring({
    frame: surgePhase,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10, stiffness: 300, mass: 0.4 },
    durationInFrames: 12,
  });
  const surge = interpolate(surgeProgress, [0, 0.4, 1], [0, 0.6, 0]);

  const neonIntensity = Math.max(0, neonBase * 0.25 + neonFlicker + surge);

  // ── Night ambient ──────────────────────────────────────────────────────────

  const nightBreath = (Math.sin((frame / fps) * 0.5) + 1) / 2;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#05080f",
        opacity: sceneOpacity,
      }}
    >
      {/* ── Base illustration — single image, walk motion on wrapper ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${sway}px) translateY(${bob}px) rotate(${lean}deg)`,
          transformOrigin: "center bottom",
          filter: `blur(${blurAmount}px)`,
          willChange: "transform, filter",
          overflow: "hidden",
        }}
      >
        <Img
          src={imageSrc}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* ── Fireflies ── */}
      {FIREFLIES.map((f) => {
        // Slow linear drift + sinusoidal wobble
        const wx = Math.sin(frame * f.wobbleFreq + f.wobblePhase) * f.wobbleAmp;
        const wy = Math.cos(frame * f.wobbleFreq * 0.7 + f.wobblePhase) * f.wobbleAmp * 0.6;
        const fx = ((f.x0 + f.vx * frame + wx) % 1 + 1) % 1;
        const fy = ((f.y0 + f.vy * frame + wy) % 1 + 1) % 1;

        // Blink: smooth sine wave, squared to spend more time dim
        const rawBlink = (Math.sin(frame * f.blinkFreq + f.blinkPhase) + 1) / 2;
        const blink = rawBlink * rawBlink; // ease: mostly off, briefly very bright
        const alpha = blink * f.peakOpacity;

        if (alpha < 0.01) return null; // skip invisible fireflies

        const glowColor = `rgba(180, 255, 120, ${alpha})`; // warm yellow-green
        const coreColor = `rgba(240, 255, 200, ${Math.min(1, alpha * 1.8)})`;

        return (
          <React.Fragment key={f.id}>
            {/* Outer glow */}
            <div
              style={{
                position: "absolute",
                left: `${fx * 100}%`,
                top: `${fy * 100}%`,
                width: f.size * 5,
                height: f.size * 5,
                borderRadius: "50%",
                background: glowColor,
                transform: "translate(-50%, -50%)",
                filter: `blur(${f.size * 1.8}px)`,
                mixBlendMode: "screen",
                pointerEvents: "none",
              }}
            />
            {/* Bright core */}
            <div
              style={{
                position: "absolute",
                left: `${fx * 100}%`,
                top: `${fy * 100}%`,
                width: f.size,
                height: f.size,
                borderRadius: "50%",
                background: coreColor,
                transform: "translate(-50%, -50%)",
                mixBlendMode: "screen",
                pointerEvents: "none",
              }}
            />
          </React.Fragment>
        );
      })}

      {/* ── Bokeh circles near neon ── */}
      {BOKEH.map((b) => {
        const bx = ((b.x + b.vx * frame) % 1 + 1) % 1;
        const by = ((b.y + b.vy * frame) % 1 + 1) % 1;
        const pulse = Math.sin(frame * b.pulseFreq + b.pulsePhase) * 0.35 + 0.65;
        const alpha = b.opacity * pulse * (0.4 + neonIntensity * 2);
        const colorStr = b.color.replace("__A__", String(alpha));

        return (
          <div
            key={b.id}
            style={{
              position: "absolute",
              left: `${bx * 100}%`,
              top: `${by * 100}%`,
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              background: colorStr,
              transform: "translate(-50%, -50%)",
              filter: `blur(${b.size * 0.35}px)`,
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* ── Neon MuViM sign glow — upper-right quadrant ── */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "40%",
          height: "35%",
          background: `radial-gradient(ellipse at 65% 30%, rgba(255,80,180,${
            neonIntensity
          }) 0%, rgba(120,40,220,${neonIntensity * 0.6}) 40%, transparent 70%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* ── Secondary neon reflection on ground/figure ── */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          right: "10%",
          width: "50%",
          height: "40%",
          background: `radial-gradient(ellipse at 50% 80%, rgba(180,60,220,${
            neonIntensity * 0.3
          }) 0%, transparent 60%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* ── Night ambient blue breathe ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 30% 50%, rgba(40,80,180,${
            0.04 + nightBreath * 0.06
          }) 0%, transparent 70%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* ── Vignette ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.5) 100%)",
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

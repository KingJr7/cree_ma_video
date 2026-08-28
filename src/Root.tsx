import React from "react";
import { AbsoluteFill, Audio, Composition, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { BgMesh, Grade, Grain, Vignette } from "./components/Layers";
import { ImageCard } from "./components/ImageCard";
import { SyncedCaptions } from "./components/SyncedCaptions";
import { SnareFx, FPS } from "./audio";
import { CHUNKS, msToFrame } from "./timeline";
import { theme } from "./theme";

loadDisplay();
loadMono();

// petite scène "fond" motion design ambré : pictos flottants (€) qui respirent
const FloatMarks: React.FC = () => (
  <>
    {[
      { t: "€", x: "8%", y: "16%", s: 150, delay: 0 },
      { t: "♪", x: "86%", y: "12%", s: 120, delay: 20 },
      { t: "€", x: "88%", y: "70%", s: 170, delay: 40 },
      { t: "€", x: "9%", y: "76%", s: 110, delay: 10 },
    ].map((m, i) => (
      <AbsoluteFill key={i}>
        <div
          style={{
            position: "absolute",
            left: m.x,
            top: m.y,
            fontSize: m.s,
            color: `${theme.colors.primary}${i === 1 ? "30" : "24"}`,
            transform: `translate(-50%,-50%)`,
          }}
        >
          <FloatOne delay={m.delay} char={i === 1 ? "♪" : "€"} />
        </div>
      </AbsoluteFill>
    ))}
  </>
);

const FloatOne: React.FC<{ delay: number; char?: string }> = ({ delay, char = "€" }) => {
  const frame = useCurrentFrame();
  const y = Math.sin((frame + delay) / 48) * 26;
  const rot = Math.sin((frame + delay) / 60) * 10;
  const op = 0.5 + 0.5 * Math.sin((frame + delay) / 40);
  return <span style={{ display: "inline-block", transform: `translateY(${y}px) rotate(${rot}deg)`, opacity: 0.3 + 0.3 * op }}>{char}</span>;
};

// Badge kicker du chunk actif
const Kicker: React.FC<{ active: number }> = ({ active }) => {
  const chunk = CHUNKS[active];
  if (!chunk) return null;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - chunk.from;
  const p = spring({ frame: local, fps, config: theme.spring.smooth });
  const end = chunk.from + chunk.duration;
  const o = interpolate(frame, [end - 12, end - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o }}>
      <div
        style={{
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
          fontFamily: theme.fonts.mono,
          fontSize: 30,
          letterSpacing: "0.28em",
          padding: "14px 32px",
          borderRadius: 999,
          background: "rgba(20,16,10,0.6)",
          border: `1px solid ${theme.colors.primary}44`,
          color: theme.colors.text,
        }}
      >
        {chunk.kicker.toUpperCase()}
      </div>
    </div>
  );
};

const VO_END_MS = 22143;
const TOTAL_MS = 30000;

const VoixVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.max(0, CHUNKS.findIndex((c) => frame >= c.from && frame < c.from + c.duration));
  const showEnd = frame >= msToFrame(VO_END_MS);

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      {/* fond motion design */}
      <BgMesh />
      <FloatMarks />

      {/* cartes d'images (chaque carte gère sa propre entrée/sortie) */}
      {CHUNKS.map((c) => (
        <AbsoluteFill key={c.id}>
          {c.cards.map((card, i) => (
            <ImageCard
              key={i}
              src={card.img}
              from={card.from}
              duration={card.from + card.duration}
              zoom={card.zoom}
            />
          ))}
        </AbsoluteFill>
      ))}

      <Kicker active={active} />

      {/* captions mot-à-mot synchronisées (motion design principal) */}
      <SyncedCaptions />

      {/* end-card après la voix */}
      {showEnd ? <EndCard /> : null}

      {/* voix off + nappe musicale duckée */}
      <Audio src={staticFile("audio_voix.wav")} volume={0.95} />
      <SnareFx />

      {/* couches 4–5 : grade, grain + vignette */}
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - msToFrame(VO_END_MS);
  const p = spring({ frame: local, fps, config: theme.spring.smooth });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 40, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`, textAlign: "center" }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 148, letterSpacing: "-0.03em", lineHeight: 1, color: theme.colors.text, textShadow: `0 0 60px ${theme.colors.glow}, 0 0 130px ${theme.colors.glow}` }}>
        Normal
        <br />
        {"ou "}
        <span style={{ color: theme.colors.primary }}>abusé ?</span>
      </div>
      <div style={{ marginTop: 44, fontFamily: theme.fonts.mono, fontSize: 30, letterSpacing: "0.14em", color: theme.colors.textDim }}>
        SAUVEGARDE POUR LA PARTAGER
      </div>
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition
    id="VoixVideo"
    component={VoixVideo}
    durationInFrames={msToFrame(TOTAL_MS)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);

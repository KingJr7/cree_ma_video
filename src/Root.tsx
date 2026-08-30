import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { BgMesh, Grade, Grain, Vignette } from "./components/Layers";
import { ImageCard } from "./components/ImageCard";
import { SyncedCaptions } from "./components/SyncedCaptions";
import { SnareFx, FPS } from "./audio";
import { CHUNKS, msToFrame } from "./timeline";
import { theme as oldTheme } from "./theme";
import { S1Hook } from "./deuxnous/S1Hook";
import { S2Create } from "./deuxnous/S2Create";
import { S3RSVP } from "./deuxnous/S3RSVP";
import { S4JourJ } from "./deuxnous/S4JourJ";
import { S5Album } from "./deuxnous/S5Album";
import { S5Outro as S6Outro } from "./deuxnous/S5Outro";
import { AudioDeuxnous } from "./deuxnous/AudioDeuxnous";
import { theme as dnTheme } from "./deuxnous/theme";

loadDisplay();
loadMono();
loadFraunces();
loadGeist();

// === VoixVideo (Congo, déjà existante) ===

const VO_END_MS = 22143;
const TOTAL_MS = 30000;

const VoixVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.max(0, CHUNKS.findIndex((c) => frame >= c.from && frame < c.from + c.duration));
  const showEnd = frame >= msToFrame(VO_END_MS);

  return (
    <AbsoluteFill style={{ background: oldTheme.colors.bg }}>
      <BgMesh />
      {CHUNKS.map((c) => (
        <AbsoluteFill key={c.id}>
          {c.cards.map((card, i) => (
            <ImageCard key={i} src={card.img} from={card.from} duration={card.from + card.duration} zoom={card.zoom} />
          ))}
        </AbsoluteFill>
      ))}
      <Kicker active={active} />
      <SyncedCaptions />
      {showEnd ? <EndCard /> : null}
      <Audio src={staticFile("audio_voix.wav")} volume={0.95} />
      <SnareFx />
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{ active: number }> = ({ active }) => {
  const chunk = CHUNKS[active];
  if (!chunk) return null;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - chunk.from;
  const p = spring({ frame: local, fps, config: oldTheme.spring.smooth });
  const end = chunk.from + chunk.duration;
  const o = interpolate(frame, [end - 12, end - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o }}>
      <div
        style={{
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
          fontFamily: oldTheme.fonts.mono,
          fontSize: 30,
          letterSpacing: "0.28em",
          padding: "14px 32px",
          borderRadius: 999,
          background: "rgba(20,16,10,0.6)",
          border: `1px solid ${oldTheme.colors.primary}44`,
          color: oldTheme.colors.text,
        }}
      >
        {chunk.kicker.toUpperCase()}
      </div>
    </div>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - msToFrame(VO_END_MS);
  const p = spring({ frame: local, fps, config: oldTheme.spring.smooth });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 40, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`, textAlign: "center" }}>
      <div style={{ fontFamily: oldTheme.fonts.display, fontWeight: 700, fontSize: 148, letterSpacing: "-0.03em", lineHeight: 1, color: oldTheme.colors.text, textShadow: `0 0 60px ${oldTheme.colors.glow}, 0 0 130px ${oldTheme.colors.glow}` }}>
        Normal
        <br />
        {"ou "}
        <span style={{ color: oldTheme.colors.primary }}>abusé ?</span>
      </div>
      <div style={{ marginTop: 44, fontFamily: oldTheme.fonts.mono, fontSize: 30, letterSpacing: "0.14em", color: oldTheme.colors.textDim }}>
        SAUVEGARDE POUR LA PARTAGER
      </div>
    </AbsoluteFill>
  );
};

// === Deuxnous — 40s, 1920×1080 ===

const DEUXNOUS_FPS = 30;
const DEUXNOUS_FRAMES = 40 * DEUXNOUS_FPS; // 1200
// Timeline (frames absolues @ 30 fps) :
//   S1 Hook      : 0    – 150  (5s)
//   S2 Création  : 150  – 330  (6s)
//   S3 RSVP      : 330  – 540  (7s)
//   S4 Jour J    : 540  – 840  (10s)
//   S5 Album     : 840  – 1020 (6s)
//   S6 Outro     : 1020 – 1200 (6s)

const Deuxnous: React.FC = () => (
  <AbsoluteFill style={{ background: dnTheme.colors.bg }}>
    <Sequence from={0} durationInFrames={150}><S1Hook /></Sequence>
    <Sequence from={150} durationInFrames={180}><S2Create /></Sequence>
    <Sequence from={330} durationInFrames={210}><S3RSVP /></Sequence>
    <Sequence from={540} durationInFrames={300}><S4JourJ /></Sequence>
    <Sequence from={840} durationInFrames={180}><S5Album /></Sequence>
    <Sequence from={1020} durationInFrames={180}><S6Outro /></Sequence>
    <AudioDeuxnous />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="VoixVideo" component={VoixVideo} durationInFrames={msToFrame(TOTAL_MS)} fps={FPS} width={1080} height={1920} />
    <Composition id="Deuxnous" component={Deuxnous} durationInFrames={DEUXNOUS_FRAMES} fps={DEUXNOUS_FPS} width={1920} height={1080} />
  </>
);

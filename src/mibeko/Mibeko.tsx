// Mibeko — vidéo TikTok 9:16, style sobre/éditorial, fond noir + blanc cassé.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme, TOTAL_FRAMES } from "./theme";
import { SCENES } from "./data";
import { SceneImage, Eyebrow, Pill, Wordmark, StoreButtons } from "./Scene";
import { SyncedCaption } from "./SyncedCaption";
import { AudioMibeko } from "./AudioMibeko";

export const Mibeko: React.FC = () => (
  <AbsoluteFill style={{ background: theme.colors.bg }}>
    {SCENES.map((s) => (
      <SceneImage key={s.id} scene={s} />
    ))}
    {SCENES.map((s) => (
      <Eyebrow key={`e-${s.id}`} scene={s} />
    ))}
    {SCENES.map((s) => (
      <Pill key={`p-${s.id}`} scene={s} />
    ))}
    <StoryProgress />
    <Wordmark />
    <SyncedCaption />
    <StoreButtons />
    <AudioMibeko />
  </AbsoluteFill>
);

const StoryProgress: React.FC = () => {
  const frame = useCurrentFrame();
  const p = Math.min(1, frame / TOTAL_FRAMES);
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 10, zIndex: 8, background: "rgba(245,241,232,0.12)" }}>
      <div style={{ width: `${p * 100}%`, height: "100%", background: theme.colors.accent }} />
    </div>
  );
};

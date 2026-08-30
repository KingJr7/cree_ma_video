// Mibeko — caption word-sync : affiche les mots déjà prononcés, surligne le mot actif.
import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { theme, FPS } from "./theme";
import { WORDS, sceneAt, type Word } from "./data";

const currentMs = (frame: number, fps: number) => (frame / fps) * 1000;

export const SyncedCaption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = currentMs(frame, fps);
  const scene = sceneAt(ms);

  // mots de la scène active (qui ont un ordre d'apparition)
  const sceneWords = WORDS.slice(scene.from, scene.to + 1);

  const spoken = sceneWords.filter((w) => w.e <= ms);
  const active = sceneWords.find((w) => ms >= w.s && ms <= w.e);
  const progress = interpolate(ms, [scene.firstMs - 900, scene.firstMs - 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom: 300,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0], {
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        })}px)`,
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontWeight: 500,
          fontSize: 62,
          lineHeight: 1.18,
          color: theme.colors.text,
          letterSpacing: "-0.01em",
        }}
      >
        {sceneWords.map((w) => {
          const isActive = active === w;
          const done = w.e <= ms;
          return (
            <span
              key={`${w.s}-${w.t}`}
              style={{
                color: isActive ? theme.colors.accent : done ? theme.colors.text : "transparent",
              }}
            >
              {w.t}{" "}
            </span>
          );
        })}
      </div>
    </div>
  );
};

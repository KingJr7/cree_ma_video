// Mibeko — fine barre de progression en haut, contraste selon le fond.
import React from "react";
import { useCurrentFrame } from "remotion";
import { TOTAL_FRAMES } from "./theme";

export const StoryProgress: React.FC<{ bg: string }> = ({ bg }) => {
  const frame = useCurrentFrame();
  const p = Math.min(1, frame / TOTAL_FRAMES);
  const color = bg === "#000000" ? "#FFFFFF" : "#000000";
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 12,
        zIndex: 8,
        background: "rgba(0,0,0,0)",
      }}
    >
      <div style={{ width: `${p * 100}%`, height: "100%", background: color, opacity: 0.9 }} />
    </div>
  );
};

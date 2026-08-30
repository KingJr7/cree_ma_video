// Mibeko v2 — karaoké mot par mot : gros mots MAJUSCULES centrés, synchro audio précise,
// pop-in scale + drop-shadow selon le fond. 1-2 mots par écran.
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { WORDS, sectionAt } from "./data";

const currentMs = (frame: number, fps: number) => (frame / fps) * 1000;

export const Karaoke: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = currentMs(frame, fps);
  const sec = sectionAt(frame);
  const fg = sec.bg === "#000000" ? "#FFFFFF" : "#000000";

  // mots audio visibles (actuellement prononcés + petite traîne)
  const visible = WORDS.filter((w) => ms >= w.s && ms < w.e + 180);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 150,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        columnGap: 22,
        padding: "0 40px",
        zIndex: 2,
      }}
    >
      {visible.map((w) => {
        const startFrame = Math.round((w.s / 1000) * fps);
        const pop = spring({ frame: frame - startFrame, fps, config: { damping: 12, stiffness: 400, mass: 0.4 } });
        const scale = interpolate(pop, [0, 1], [0.85, 1]);
        const clean = w.t.replace(/[?,.;!]/g, "");
        const fs = Math.max(64, Math.min(118, Math.floor((920 / Math.max(1, clean.length)) * 0.82)));
        const shadow =
          sec.bg === "#000000"
            ? "0 6px 0 rgba(255,255,255,0.15), 6px 6px 0 rgba(0,0,0,0.35)"
            : "0 6px 0 rgba(0,0,0,0.12), 6px 6px 22px rgba(0,0,0,0.28)";
        return (
          <span
            key={`${w.s}-${w.t}`}
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 900,
              fontSize: fs,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              color: fg,
              textTransform: "uppercase",
              textShadow: shadow,
              transform: `scale(${scale})`,
              whiteSpace: "nowrap",
              display: "inline-block",
            }}
          >
            {clean}
          </span>
        );
      })}
    </div>
  );
};

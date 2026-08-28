import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../theme";
import { PAGES, wordActiveAt } from "../vo";

// Captions TikTok mot-à-mot synchronisées sur la parole.
// Une page active = la fenêtre de la frame courante ; le mot en cours
// d'énonciation s'illumine en ambre-herbe.
export const SyncedCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame / fps) * 1000;

  const activeIdx = PAGES.findIndex((p) => t >= p.start && t <= p.end);
  if (activeIdx === -1) return null;
  const page = PAGES[activeIdx];
  const activeWord = wordActiveAt(t, page);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "66%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.22em 0.5em",
        padding: "0 60px",
        fontFamily: theme.fonts.display,
        fontWeight: 700,
        fontSize: 72,
        letterSpacing: "-0.02em",
        lineHeight: 1.18,
        textAlign: "center",
      }}
    >
      {page.words.map((w) => {
        const active = w === activeWord;
        return (
          <span
            key={`${w.s}-${w.t}`}
            style={{
              color: active ? "#12100A" : theme.colors.text,
              backgroundColor: active ? theme.colors.primary : "transparent",
              padding: active ? "0 0.18em" : 0,
              borderRadius: 12,
              textShadow: active
                ? "none"
                : "0 2px 22px rgba(0,0,0,0.9)",
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

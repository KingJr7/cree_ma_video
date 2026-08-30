// Mibeko2 — style bicolore noir/blanc cut direct, sticker média (photo/vidéo Pexels) centré/agrandi,
// karaoké mot par mot MAJUSCULES en bas, motion design + sound design.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SECTIONS, sectionAt } from "./data";
import { MediaTile } from "./MediaTile";
import { Karaoke } from "./Karaoke";
import { StoryProgress } from "./Progress";
import { AudioMibeko2 } from "./AudioMibeko2";

export const Mibeko2: React.FC = () => {
  const frame = useCurrentFrame();
  const sec = sectionAt(frame);
  const media = SECTIONS.flatMap((s) => s.media);

  return (
    <AbsoluteFill style={{ background: sec.bg }}>
      <AbsoluteFill style={{ background: sec.bg }} />

      {media.map((m, i) => (
        <MediaTile key={`${m.src}-${i}`} m={m} centerY={960} />
      ))}

      <Karaoke />

      <Brand bg={sec.bg} />
      <StoryProgress bg={sec.bg} />
      <AudioMibeko2 />
    </AbsoluteFill>
  );
};

const Brand: React.FC<{ bg: string }> = ({ bg }) => {
  const fg = bg === "#000000" ? "#000000" : "#FFFFFF";
  const text = bg === "#000000" ? "#FFFFFF" : "#000000";
  return (
    <div
      style={{
        position: "absolute",
        top: 90,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 6,
        fontFamily: "Space Grotesk",
        fontWeight: 800,
        letterSpacing: "0.22em",
        fontSize: 30,
        color: text,
      }}
    >
      <span style={{ background: fg, padding: "14px 26px", borderRadius: 999 }}>MIBEKO</span>
    </div>
  );
};

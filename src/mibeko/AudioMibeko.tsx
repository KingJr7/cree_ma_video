// Mibeko v2 — voix off complète + nappe légère + sound design (pops/whoosh sync aux coupes)
import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { SECTIONS } from "./data";

const F = ({ from, src, vol = 0.5 }: { from: number; src: string; vol?: number }) => (
  <Sequence from={from}>
    <Audio src={staticFile(src)} volume={vol} />
  </Sequence>
);

export const AudioMibeko: React.FC = () => {
  const drops: React.ReactNode[] = [];
  SECTIONS.forEach((s, i) => {
    // pop au cut de section (changement de fond / mot majeur)
    drops.push(<F key={`pop-${s.id}`} from={s.from} src="sfx/pop2.wav" vol={0.55} />);
    // whoosh à chaque apparition de média
    s.media.forEach((m, mi) => {
      drops.push(<F key={`who-${s.id}-${mi}`} from={m.from} src="sfx/whoosh.wav" vol={0.4} />);
    });
  });

  return (
    <>
      <Audio src={staticFile("sfx/track.wav")} volume={0.1} />
      <Audio src={staticFile("voicecc.mp3")} volume={0.95} />
      {drops}
    </>
  );
};

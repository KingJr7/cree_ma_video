import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

export const FPS = 30;
const CUTS = [127, 227, 367, 472, 548, 604, 677]; // transitions de chapitres + end-card (frame)

// Nappe musicale + SFX très discrets, duckés sous la voix off.
export const SnareFx: React.FC = () => (
  <>
    <Audio src={staticFile("sfx/track.wav")} volume={0.18} />
    {CUTS.map((cut) => (
      <React.Fragment key={`cut-${cut}`}>
        <Sequence from={cut - 3}>
          <Audio src={staticFile("sfx/whoosh.wav")} volume={0.22} />
        </Sequence>
        <Sequence from={cut}>
          <Audio src={staticFile("sfx/bass.wav")} volume={0.3} />
        </Sequence>
      </React.Fragment>
    ))}
  </>
);

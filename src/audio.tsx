import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

// Placement audio — tout dérivé de la grille de beats (120 BPM = 15 frames).
// Les coupes de scènes tombent sur des multiples de 15.
export const FPS = 30;
const CUTS = [0, 90, 150, 300, 450, 600, 795]; // débuts de scènes

const range = (from: number, to: number, step: number): number[] => {
  const out: number[] = [];
  for (let f = from; f <= to; f += step) out.push(f);
  return out;
};

// Ticks pendant les compteurs (fenêtres absolues)
const TICK_FRAMES = [
  ...range(162, 204, 5), // compteur 50 %
  ...range(312, 354, 5), // compteur 30 %
  ...range(462, 504, 5), // compteur 20 %
  ...range(612, 654, 6), // salaire
  ...range(628, 664, 6), // montants des lignes
];

export const SoundTrack: React.FC = () => (
  <>
    {/* Nappe musicale, sous tout le reste */}
    <Audio src={staticFile("sfx/track.wav")} volume={0.24} />

    {/* Whoosh 2-3 frames AVANT la coupe, basse SUR la coupe */}
    {CUTS.filter((c) => c > 0).map((cut) => (
      <React.Fragment key={`cut-${cut}`}>
        <Sequence from={cut - 3}>
          <Audio src={staticFile("sfx/whoosh.wav")} volume={0.5} />
        </Sequence>
        <Sequence from={cut}>
          <Audio src={staticFile("sfx/bass.wav")} volume={0.6} />
        </Sequence>
      </React.Fragment>
    ))}

    {/* Pop sur chaque pastille 50 / 30 / 20 */}
    {[100, 106, 112].map((f) => (
      <Sequence key={`pop-${f}`} from={f}>
        <Audio src={staticFile("sfx/pop.wav")} volume={0.55} />
      </Sequence>
    ))}

    {/* Ticks des compteurs */}
    {TICK_FRAMES.map((f) => (
      <Sequence key={`tick-${f}`} from={f}>
        <Audio src={staticFile("sfx/tick.wav")} volume={0.22} />
      </Sequence>
    ))}
  </>
);

import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

// Audio pour DeuxnousZokaly — sparse, high-pulse :
//   - nappe Amapiano continue (volume 0.18)
//   - SFX discrets sur les key-frames

const F = ({ from, src, vol }: { from: number; src: string; vol: number }) => (
  <Sequence from={from}>
    <Audio src={staticFile(src)} volume={vol} />
  </Sequence>
);

export const AudioZk: React.FC = () => (
  <>
    <Audio src={staticFile("sfx/amapiano.wav")} volume={0.18} />

    {/* S1 Problème (0-210) — pops sur les mots, swoosh sur push-up final */}
    <F from={0} src="sfx/whoosh.wav" vol={0.4} />
    <F from={30} src="sfx/pop2.wav" vol={0.5} />
    <F from={38} src="sfx/pop2.wav" vol={0.5} />
    <F from={46} src="sfx/pop2.wav" vol={0.5} />
    <F from={54} src="sfx/pop2.wav" vol={0.5} />
    <F from={60} src="sfx/pop2.wav" vol={0.45} />
    <F from={68} src="sfx/pop2.wav" vol={0.45} />
    <F from={76} src="sfx/pop2.wav" vol={0.45} />
    <F from={100} src="sfx/bass.wav" vol={0.4} />
    <F from={108} src="sfx/pop2.wav" vol={0.5} />
    <F from={116} src="sfx/pop2.wav" vol={0.5} />
    <F from={195} src="sfx/swoosh.wav" vol={0.5} />

    {/* S2 Solution (210-450) — swoosh push-down, click, success, popups dashboard */}
    <F from={210} src="sfx/swoosh.wav" vol={0.5} />
    <F from={250} src="sfx/success.wav" vol={0.5} />
    <F from={270} src="sfx/pop2.wav" vol={0.5} />
    <F from={290} src="sfx/pop2.wav" vol={0.45} />
    <F from={310} src="sfx/pop2.wav" vol={0.45} />
    <F from={330} src="sfx/pop2.wav" vol={0.45} />
    <F from={350} src="sfx/pop2.wav" vol={0.45} />

    {/* S3 Features (450-900) — chime sur chaque feature, pops sur satellites */}
    <F from={450} src="sfx/chime.wav" vol={0.4} />
    <F from={530} src="sfx/pop2.wav" vol={0.45} />
    <F from={540} src="sfx/pop2.wav" vol={0.45} />
    <F from={550} src="sfx/pop2.wav" vol={0.45} />
    <F from={560} src="sfx/pop2.wav" vol={0.45} />
    <F from={620} src="sfx/chime.wav" vol={0.4} />
    <F from={680} src="sfx/pop2.wav" vol={0.45} />
    <F from={690} src="sfx/pop2.wav" vol={0.45} />
    <F from={700} src="sfx/pop2.wav" vol={0.45} />
    <F from={710} src="sfx/pop2.wav" vol={0.45} />
    <F from={760} src="sfx/chime.wav" vol={0.4} />
    <F from={820} src="sfx/pop2.wav" vol={0.45} />
    <F from={830} src="sfx/pop2.wav" vol={0.45} />
    <F from={840} src="sfx/pop2.wav" vol={0.45} />
    <F from={850} src="sfx/pop2.wav" vol={0.45} />
    <F from={880} src="sfx/chime.wav" vol={0.4} />

    {/* S4 CTA (900-1170) — kick, success, click, confettis */}
    <F from={900} src="sfx/swoosh.wav" vol={0.5} />
    <F from={930} src="sfx/success.wav" vol={0.5} />
    <F from={945} src="sfx/pop2.wav" vol={0.55} />
    {Array.from({ length: 20 }).map((_, i) => (
      <F key={`cf-${i}`} from={970 + i * 4} src="sfx/pop2.wav" vol={0.35} />
    ))}
    <F from={1010} src="sfx/click.wav" vol={0.55} />
    <F from={1150} src="sfx/success.wav" vol={0.55} />
  </>
);

import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

const F = ({ from, src, vol }: { from: number; src: string; vol: number }) => (
  <Sequence from={from}>
    <Audio src={staticFile(src)} volume={vol} />
  </Sequence>
);

export const AudioH: React.FC = () => (
  <>
    <Audio src={staticFile("sfx/amapiano.wav")} volume={0.18} />

    {/* S1 Hook (0-150) */}
    <F from={0} src="sfx/whoosh.wav" vol={0.45} />
    <F from={0} src="sfx/pop2.wav" vol={0.5} />
    <F from={4} src="sfx/pop2.wav" vol={0.5} />
    <F from={8} src="sfx/pop2.wav" vol={0.5} />
    <F from={12} src="sfx/pop2.wav" vol={0.5} />
    <F from={16} src="sfx/pop2.wav" vol={0.45} />
    <F from={80} src="sfx/swoosh.wav" vol={0.6} />
    <F from={104} src="sfx/success.wav" vol={0.55} />
    <F from={110} src="sfx/chime.wav" vol={0.4} />

    {/* S2 Création (150-330) */}
    <F from={150} src="sfx/swoosh.wav" vol={0.45} />
    <F from={165} src="sfx/tick.wav" vol={0.45} />
    <F from={172} src="sfx/tick.wav" vol={0.45} />
    <F from={180} src="sfx/tick.wav" vol={0.45} />
    <F from={187} src="sfx/tick.wav" vol={0.45} />
    <F from={205} src="sfx/tick.wav" vol={0.45} />
    <F from={212} src="sfx/tick.wav" vol={0.45} />
    <F from={219} src="sfx/tick.wav" vol={0.45} />
    <F from={226} src="sfx/tick.wav" vol={0.45} />
    <F from={232} src="sfx/tick.wav" vol={0.45} />
    <F from={237} src="sfx/tick.wav" vol={0.45} />
    <F from={240} src="sfx/click.wav" vol={0.6} />
    <F from={252} src="sfx/chime.wav" vol={0.55} />
    <F from={258} src="sfx/success.wav" vol={0.5} />
    <F from={295} src="sfx/pop2.wav" vol={0.5} />
    <F from={310} src="sfx/pop2.wav" vol={0.5} />

    {/* S3 RSVP (330-540) */}
    <F from={330} src="sfx/swoosh.wav" vol={0.5} />
    <F from={362} src="sfx/click.wav" vol={0.6} />
    <F from={380} src="sfx/swoosh.wav" vol={0.55} />
    {Array.from({ length: 12 }).map((_, i) => (
      <F key={`num-${i}`} from={442 + i * 4} src="sfx/tick.wav" vol={0.45} />
    ))}
    <F from={494} src="sfx/click.wav" vol={0.65} />
    <F from={520} src="sfx/success.wav" vol={0.6} />
    <F from={526} src="sfx/chime.wav" vol={0.45} />

    {/* S4 Jour J (540-840) */}
    <F from={540} src="sfx/swoosh.wav" vol={0.5} />
    {Array.from({ length: 6 }).map((_, i) => (
      <F key={`cash-${i}`} from={570 + i * 40} src="sfx/cash.wav" vol={0.55} />
    ))}
    {Array.from({ length: 7 }).map((_, i) => (
      <F key={`shut-${i}`} from={620 + i * 40} src="sfx/shutter.wav" vol={0.5} />
    ))}
    <F from={720} src="sfx/chime.wav" vol={0.5} />
    <F from={820} src="sfx/success.wav" vol={0.45} />

    {/* S5 Album (840-1020) */}
    <F from={840} src="sfx/swoosh.wav" vol={0.5} />
    <F from={870} src="sfx/chime.wav" vol={0.5} />
    {Array.from({ length: 8 }).map((_, i) => (
      <F key={`photo-${i}`} from={875 + i * 14} src="sfx/shutter.wav" vol={0.45} />
    ))}
    <F from={1000} src="sfx/success.wav" vol={0.5} />

    {/* S6 Outro (1020-1200) */}
    <F from={1020} src="sfx/swoosh.wav" vol={0.5} />
    <F from={1045} src="sfx/success.wav" vol={0.55} />
    <F from={1050} src="sfx/chime.wav" vol={0.4} />
    {Array.from({ length: 6 }).map((_, i) => (
      <F key={`conf-${i}`} from={1055 + i * 8} src="sfx/pop2.wav" vol={0.4} />
    ))}
    <F from={1080} src="sfx/pop2.wav" vol={0.55} />
    <F from={1110} src="sfx/click.wav" vol={0.6} />
    <F from={1180} src="sfx/success.wav" vol={0.6} />
  </>
);

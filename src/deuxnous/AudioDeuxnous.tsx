import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

// AudioDeuxnous — pose la nappe Amapiano + chaque SFX à la frame ciblée.
// Le beat tourne en boucle sous tout (volume 0.22), les SFX claquent par-dessus.
// Timeline (frames absolues @ 30 fps) :
//   S1 Hook     : 0    – 150
//   S2 Création : 150  – 330
//   S3 RSVP     : 330  – 540
//   S4 Jour J   : 540  – 840
//   S5 Album    : 840  – 1020
//   S6 Outro    : 1020 – 1200

const Frame = ({ from, src, vol }: { from: number; src: string; vol: number }) => (
  <Sequence from={from}>
    <Audio src={staticFile(src)} volume={vol} />
  </Sequence>
);

export const AudioDeuxnous: React.FC = () => (
  <>
    {/* Nappe Amapiano continue */}
    <Audio src={staticFile("sfx/amapiano.wav")} volume={0.22} />

    {/* S1 Hook (0–150) */}
    <Frame from={0} src="sfx/whoosh.wav" vol={0.45} />
    <Frame from={12} src="sfx/pop2.wav" vol={0.5} />
    <Frame from={24} src="sfx/pop2.wav" vol={0.5} />
    <Frame from={36} src="sfx/pop2.wav" vol={0.5} />
    <Frame from={48} src="sfx/pop2.wav" vol={0.5} />
    <Frame from={60} src="sfx/pop2.wav" vol={0.5} />
    <Frame from={80} src="sfx/swoosh.wav" vol={0.6} />
    <Frame from={104} src="sfx/success.wav" vol={0.55} />
    <Frame from={110} src="sfx/chime.wav" vol={0.4} />

    {/* S2 Création (150–330) — typing + clic + chime */}
    <Frame from={150} src="sfx/swoosh.wav" vol={0.45} />
    <Frame from={165} src="sfx/tick.wav" vol={0.45} />
    <Frame from={172} src="sfx/tick.wav" vol={0.45} />
    <Frame from={180} src="sfx/tick.wav" vol={0.45} />
    <Frame from={187} src="sfx/tick.wav" vol={0.45} />
    <Frame from={205} src="sfx/tick.wav" vol={0.45} />
    <Frame from={212} src="sfx/tick.wav" vol={0.45} />
    <Frame from={219} src="sfx/tick.wav" vol={0.45} />
    <Frame from={226} src="sfx/tick.wav" vol={0.45} />
    <Frame from={232} src="sfx/tick.wav" vol={0.45} />
    <Frame from={237} src="sfx/tick.wav" vol={0.45} />
    <Frame from={240} src="sfx/click.wav" vol={0.6} />
    <Frame from={252} src="sfx/chime.wav" vol={0.55} />
    <Frame from={258} src="sfx/success.wav" vol={0.5} />
    <Frame from={295} src="sfx/pop2.wav" vol={0.5} />
    <Frame from={310} src="sfx/pop2.wav" vol={0.5} />

    {/* S3 RSVP (330–540) — bulle + typing numéro + billet */}
    <Frame from={330} src="sfx/swoosh.wav" vol={0.5} />
    <Frame from={362} src="sfx/click.wav" vol={0.6} />
    <Frame from={380} src="sfx/swoosh.wav" vol={0.55} />
    {Array.from({ length: 12 }).map((_, i) => (
      <Frame key={`num-${i}`} from={442 + i * 4} src="sfx/tick.wav" vol={0.45} />
    ))}
    <Frame from={494} src="sfx/click.wav" vol={0.65} />
    <Frame from={520} src="sfx/success.wav" vol={0.6} />
    <Frame from={526} src="sfx/chime.wav" vol={0.45} />

    {/* S4 Jour J (540–840) — donations + polaroids + horloge */}
    <Frame from={540} src="sfx/swoosh.wav" vol={0.5} />
    {Array.from({ length: 6 }).map((_, i) => (
      <Frame key={`cash-${i}`} from={570 + i * 40} src="sfx/cash.wav" vol={0.55} />
    ))}
    {Array.from({ length: 7 }).map((_, i) => (
      <Frame key={`shut-${i}`} from={620 + i * 40} src="sfx/shutter.wav" vol={0.5} />
    ))}
    <Frame from={720} src="sfx/chime.wav" vol={0.5} />
    <Frame from={820} src="sfx/success.wav" vol={0.45} />

    {/* S5 Album Live (840–1020) — chaque polaroid qui arrive = shutter */}
    <Frame from={840} src="sfx/swoosh.wav" vol={0.5} />
    <Frame from={870} src="sfx/chime.wav" vol={0.5} />
    {Array.from({ length: 12 }).map((_, i) => (
      <Frame key={`photo-${i}`} from={875 + i * 12} src="sfx/shutter.wav" vol={0.45} />
    ))}
    <Frame from={1000} src="sfx/success.wav" vol={0.5} />

    {/* S6 Outro (1020–1200) — confettis + CTA */}
    <Frame from={1020} src="sfx/swoosh.wav" vol={0.5} />
    <Frame from={1045} src="sfx/success.wav" vol={0.55} />
    <Frame from={1050} src="sfx/chime.wav" vol={0.4} />
    {Array.from({ length: 6 }).map((_, i) => (
      <Frame key={`conf-${i}`} from={1055 + i * 8} src="sfx/pop2.wav" vol={0.4} />
    ))}
    <Frame from={1080} src="sfx/pop2.wav" vol={0.55} />
    <Frame from={1110} src="sfx/click.wav" vol={0.6} />
    <Frame from={1180} src="sfx/success.wav" vol={0.6} />
  </>
);

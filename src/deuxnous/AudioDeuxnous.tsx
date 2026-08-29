import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

// AudioDeuxnous — pose la nappe Amapiano + chaque SFX à la frame ciblée.
// Le beat tourne en boucle sous tout (volume 0.22), les SFX claquent par-dessus.
export const AudioDeuxnous: React.FC = () => (
  <>
    <Audio src={staticFile("sfx/amapiano.wav")} volume={0.22} />

    {/* S1 Hook (0–150) */}
    <Sequence from={0}>
      <Audio src={staticFile("sfx/whoosh.wav")} volume={0.45} />
    </Sequence>
    <Sequence from={12}><Audio src={staticFile("sfx/pop2.wav")} volume={0.5} /></Sequence>
    <Sequence from={24}><Audio src={staticFile("sfx/pop2.wav")} volume={0.5} /></Sequence>
    <Sequence from={36}><Audio src={staticFile("sfx/pop2.wav")} volume={0.5} /></Sequence>
    <Sequence from={48}><Audio src={staticFile("sfx/pop2.wav")} volume={0.5} /></Sequence>
    <Sequence from={60}><Audio src={staticFile("sfx/pop2.wav")} volume={0.5} /></Sequence>
    <Sequence from={80}><Audio src={staticFile("sfx/swoosh.wav")} volume={0.6} /></Sequence>
    <Sequence from={104}><Audio src={staticFile("sfx/success.wav")} volume={0.55} /></Sequence>
    <Sequence from={110}><Audio src={staticFile("sfx/chime.wav")} volume={0.4} /></Sequence>

    {/* S2 Création (150–360) */}
    <Sequence from={150}><Audio src={staticFile("sfx/swoosh.wav")} volume={0.45} /></Sequence>
    {/* typing "Jean" : 165, 175, 185, 192 */}
    <Sequence from={165}><Audio src={staticFile("sfx/tick.wav")} volume={0.45} /></Sequence>
    <Sequence from={172}><Audio src={staticFile("sfx/tick.wav")} volume={0.45} /></Sequence>
    <Sequence from={180}><Audio src={staticFile("sfx/tick.wav")} volume={0.45} /></Sequence>
    <Sequence from={187}><Audio src={staticFile("sfx/tick.wav")} volume={0.45} /></Sequence>
    {/* typing "& Sarah" : 205, 213, 221, 228, 234, 240, 244 */}
    <Sequence from={205}><Audio src={staticFile("sfx/tick.wav")} volume={0.45} /></Sequence>
    <Sequence from={212}><Audio src={staticFile("sfx/tick.wav")} volume={0.45} /></Sequence>
    <Sequence from={219}><Audio src={staticFile("sfx/tick.wav")} volume={0.45} /></Sequence>
    <Sequence from={226}><Audio src={staticFile("sfx/tick.wav")} volume={0.45} /></Sequence>
    <Sequence from={232}><Audio src={staticFile("sfx/tick.wav")} volume={0.45} /></Sequence>
    <Sequence from={237}><Audio src={staticFile("sfx/tick.wav")} volume={0.45} /></Sequence>
    <Sequence from={240}><Audio src={staticFile("sfx/click.wav")} volume={0.6} /></Sequence>
    <Sequence from={252}><Audio src={staticFile("sfx/chime.wav")} volume={0.55} /></Sequence>
    <Sequence from={258}><Audio src={staticFile("sfx/success.wav")} volume={0.5} /></Sequence>
    <Sequence from={295}><Audio src={staticFile("sfx/pop2.wav")} volume={0.5} /></Sequence>
    <Sequence from={310}><Audio src={staticFile("sfx/pop2.wav")} volume={0.5} /></Sequence>

    {/* S3 RSVP (360–600) */}
    <Sequence from={360}><Audio src={staticFile("sfx/swoosh.wav")} volume={0.5} /></Sequence>
    <Sequence from={392}><Audio src={staticFile("sfx/click.wav")} volume={0.6} /></Sequence>
    <Sequence from={410}><Audio src={staticFile("sfx/swoosh.wav")} volume={0.55} /></Sequence>
    {/* typing numéro : ~10 ticks */}
    {Array.from({ length: 12 }).map((_, i) => (
      <Sequence key={`num-${i}`} from={472 + i * 4}><Audio src={staticFile("sfx/tick.wav")} volume={0.45} /></Sequence>
    ))}
    <Sequence from={524}><Audio src={staticFile("sfx/click.wav")} volume={0.65} /></Sequence>
    <Sequence from={550}><Audio src={staticFile("sfx/success.wav")} volume={0.6} /></Sequence>
    <Sequence from={556}><Audio src={staticFile("sfx/chime.wav")} volume={0.45} /></Sequence>

    {/* S4 Jour J (600–1050) — donations + polaroids + horloge */}
    <Sequence from={600}><Audio src={staticFile("sfx/swoosh.wav")} volume={0.5} /></Sequence>
    {Array.from({ length: 6 }).map((_, i) => (
      <Sequence key={`cash-${i}`} from={630 + i * 40}>
        <Audio src={staticFile("sfx/cash.wav")} volume={0.55} />
      </Sequence>
    ))}
    {/* polaroids shutter */}
    {Array.from({ length: 7 }).map((_, i) => (
      <Sequence key={`shut-${i}`} from={680 + i * 50}>
        <Audio src={staticFile("sfx/shutter.wav")} volume={0.5} />
      </Sequence>
    ))}
    <Sequence from={780}><Audio src={staticFile("sfx/chime.wav")} volume={0.5} /></Sequence>
    <Sequence from={1000}><Audio src={staticFile("sfx/success.wav")} volume={0.45} /></Sequence>

    {/* S5 Outro (1050–1200) */}
    <Sequence from={1050}><Audio src={staticFile("sfx/swoosh.wav")} volume={0.5} /></Sequence>
    <Sequence from={1075}><Audio src={staticFile("sfx/success.wav")} volume={0.55} /></Sequence>
    <Sequence from={1080}><Audio src={staticFile("sfx/chime.wav")} volume={0.4} /></Sequence>
    {Array.from({ length: 6 }).map((_, i) => (
      <Sequence key={`conf-${i}`} from={1085 + i * 8}>
        <Audio src={staticFile("sfx/pop2.wav")} volume={0.4} />
      </Sequence>
    ))}
    <Sequence from={1110}><Audio src={staticFile("sfx/pop2.wav")} volume={0.55} /></Sequence>
    <Sequence from={1140}><Audio src={staticFile("sfx/click.wav")} volume={0.6} /></Sequence>
    <Sequence from={1180}><Audio src={staticFile("sfx/success.wav")} volume={0.6} /></Sequence>
  </>
);

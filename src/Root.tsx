import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, staticFile } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { BgMesh, Grade, Grain, Vignette } from "./components/Layers";
import { Scene } from "./scenes/Scene";
import { CTA } from "./scenes/CTA";
import { SnareFx, FPS } from "./audio";
import { theme } from "./theme";

loadDisplay();
loadMono();

const f = (s: number) => Math.round(FPS * s);

// Coupes de scènes sur la grille de beats (multiples de 15) — VO de 22,14 s,
// vidéo de 30 s. Les captions restent synchro via les timestamps.
const SCENES = {
  hook: f(3.5), // 0.0 – 3.5  : hook (porte / logeur)
  justice: f(6.5), // 3.5 – 10   : la loi / tribunal / justice
  eau: f(6.0), // 10   – 16   : couper l'eau / l'électricité
  serrures: f(4.0), // 16   – 20   : changer les serrures / faute
  cta: f(10.0), // 20   – 30   : normal ou abusé ? + CTA
};
const TOTAL_F = Object.values(SCENES).reduce((a, b) => a + b, 0); // 900

const VoixVideo: React.FC = () => {
  const s = SCENES;
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      {/* couche 1 : mesh (visible entre les images / fin de boucle) */}
      <BgMesh />

      {/* couches 2–3 : scènes, chacune porte son image + ses captions */}
      <Sequence durationInFrames={s.hook}>
        <Scene duration={s.hook} src="images/hook_door.jpeg" kicker="Congo · droit du logement" zoomTo={1.12} />
      </Sequence>
      <Sequence from={s.hook} durationInFrames={s.justice}>
        <Scene duration={s.justice} src="images/court.jpeg" kicker="Une décision de justice" zoomTo={1.06} />
      </Sequence>
      <Sequence from={s.hook + s.justice} durationInFrames={s.eau}>
        <Scene duration={s.eau} src="images/water.jpeg" kicker="Eau · électricité" zoomTo={1.1} />
      </Sequence>
      <Sequence from={s.hook + s.justice + s.eau} durationInFrames={s.serrures}>
        <Scene duration={s.serrures} src="images/lock.jpeg" kicker="Serrures · faute" zoomTo={1.06} />
      </Sequence>
      <Sequence
        from={s.hook + s.justice + s.eau + s.serrures}
        durationInFrames={s.cta}
      >
        <CTA duration={s.cta} />
      </Sequence>

      {/* voix off */}
      <Audio src={staticFile("audio_voix.wav")} volume={0.95} />

      {/* SFX + nappe musicale (ducke sous la voix) */}
      <SnareFx />

      {/* couches 4–5 : grade, grain + vignette */}
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition
    id="VoixVideo"
    component={VoixVideo}
    durationInFrames={TOTAL_F}
    fps={FPS}
    width={1080}
    height={1920}
  />
);

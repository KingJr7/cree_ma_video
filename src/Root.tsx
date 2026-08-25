import React from "react";
import { AbsoluteFill, Composition, Sequence } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { BgMesh, Grade, Grain, Vignette } from "./components/Layers";
import { SoundTrack, FPS } from "./audio";
import { theme } from "./theme";
import { Hook, HOOK_S } from "./scenes/Hook";
import { RuleIntro, INTRO_S } from "./scenes/RuleIntro";
import { Beat, BEAT_S, type BeatData } from "./scenes/Beat";
import type { Segment } from "./components/Donut";
import { Payoff, PAYOFF_S } from "./scenes/Payoff";
import { CTA, CTA_S } from "./scenes/CTA";

loadDisplay();
loadMono();

const f = (s: number) => Math.round(FPS * s);

// Segments du donut — les couleurs portent la règle.
const SEG_50: Segment = { pct: 50, color: theme.colors.cream, startPct: 0 };
const SEG_30: Segment = { pct: 30, color: theme.colors.primary, startPct: 50 };
const SEG_20: Segment = { pct: 20, color: theme.colors.accent, startPct: 80 };

const BEAT_50: BeatData = {
  pct: 50,
  label: "Besoins",
  color: theme.colors.cream,
  examples: ["Loyer & courses", "Factures", "Transport"],
};
const BEAT_30: BeatData = {
  pct: 30,
  label: "Envies",
  color: theme.colors.primary,
  examples: ["Restos & sorties", "Abonnements", "Plaisirs"],
};
const BEAT_20: BeatData = {
  pct: 20,
  label: "Épargne",
  color: theme.colors.accent,
  examples: ["Virement auto", "Jour de paie", "Objectifs"],
};

const SCENE_F = {
  hook: f(HOOK_S), // 90
  intro: f(INTRO_S), // 60
  b1: f(BEAT_S), // 150
  b2: f(BEAT_S),
  b3: f(BEAT_S),
  payoff: f(PAYOFF_S), // 195
  cta: f(CTA_S), // 105
};
const TOTAL_F = Object.values(SCENE_F).reduce((a, b) => a + b, 0); // 900

const Regle503020: React.FC = () => {
  const s = SCENE_F;
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      {/* couche 1 : mesh */}
      <BgMesh />
      {/* couches 2–3 : contenu */}
      <Sequence durationInFrames={s.hook}>
        <Hook duration={s.hook} />
      </Sequence>
      <Sequence from={s.hook} durationInFrames={s.intro}>
        <RuleIntro duration={s.intro} />
      </Sequence>
      <Sequence from={s.hook + s.intro} durationInFrames={s.b1}>
        <Beat duration={s.b1} data={BEAT_50} laid={[]} />
      </Sequence>
      <Sequence from={s.hook + s.intro + s.b1} durationInFrames={s.b2}>
        <Beat duration={s.b2} data={BEAT_30} laid={[SEG_50]} />
      </Sequence>
      <Sequence from={s.hook + s.intro + s.b1 + s.b2} durationInFrames={s.b3}>
        <Beat duration={s.b3} data={BEAT_20} laid={[SEG_50, SEG_30]} />
      </Sequence>
      <Sequence
        from={s.hook + s.intro + s.b1 + s.b2 + s.b3}
        durationInFrames={s.payoff}
      >
        <Payoff duration={s.payoff} />
      </Sequence>
      <Sequence
        from={
          s.hook + s.intro + s.b1 + s.b2 + s.b3 + s.payoff
        }
        durationInFrames={s.cta}
      >
        <CTA duration={s.cta} />
      </Sequence>
      {/* audio : nappe + SFX synchronisés */}
      <SoundTrack />
      {/* couches 4–5 : grade, grain + vignette */}
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition
    id="Regle503020"
    component={Regle503020}
    durationInFrames={TOTAL_F}
    fps={FPS}
    width={1080}
    height={1920}
  />
);

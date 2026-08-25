// Nappe musicale 30 s @ 120 BPM (1 beat = 0.5 s = 15 frames) — déterministe.
// Structure calée sur les coupes de scènes (en secondes) :
//   3.0 intro | 5.0 / 10 / 15 beats | 20 payoff | 26.5 cta
// Dérivé de examples/scripts/gen-track.mjs du skill remotion-motion-graphics.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const DUR = 30;
const N = SR * DUR;
const out = new Float32Array(N);
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sfx");
mkdirSync(OUT, { recursive: true });

const add = (start, dur, fn) => {
  const s0 = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  for (let i = 0; i < n && s0 + i < N; i++) out[s0 + i] += fn(i / SR, i / n);
};

let seed = 1;
const rnd = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647 - 0.5;
};

const kick = (t) =>
  add(t, 0.28, (ts, p) => {
    const f = 140 - 95 * Math.min(1, ts * 9);
    return Math.sin(2 * Math.PI * f * ts) * Math.exp(-p * 7) * 0.8;
  });
const hat = (t) =>
  add(t, 0.045, (ts, p) => rnd() * 2 * Math.exp(-p * 10) * 0.09);
const bassNote = (t, f, dur = 0.21) =>
  add(t, dur, (ts, p) => {
    const env = Math.min(1, ts * 90) * Math.exp(-p * 4);
    return (
      (Math.sin(2 * Math.PI * f * ts) + Math.sin(2 * Math.PI * f * 3 * ts) / 3.5) *
      env *
      0.28
    );
  });
const impact = (t, gain = 0.85) => {
  add(t, 0.9, (ts, p) => {
    const f = 60 - 25 * Math.min(1, ts * 3);
    return Math.sin(2 * Math.PI * f * ts) * Math.exp(-p * 4.5) * gain;
  });
  add(t, 0.35, (ts, p) => rnd() * 2 * Math.exp(-p * 6) * gain * 0.35);
};

// Nappe ambrée — La mineur chaud sur toute la durée
add(0, DUR, (ts) => {
  const attack = Math.min(1, ts / 2);
  const release = Math.min(1, (DUR - ts) / 2.5);
  return (
    (Math.sin(2 * Math.PI * 110 * ts) +
      Math.sin(2 * Math.PI * 130.81 * ts) +
      Math.sin(2 * Math.PI * 164.81 * ts)) *
    0.042 *
    attack *
    release *
    (1 - 0.15 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 0.11 * ts)))
  );
});

const FPB = 0.5;
// Kicks : entrent avec l'intro (3 s), sortent au CTA (26.5 s)
for (let b = 6; b < 53; b++) kick(b * FPB);
// Hats en contretemps
for (let b = 10; b < 53; b++) hat(b * FPB + 0.25);

// Ligne de basse en croches, 5 -> 26 s : A1 avec passages C2/E2
const pat = [55, 55, 65.41, 55, 82.41, 55, 65.41, 73.42];
for (let e = 10; e < 104; e++) {
  const t = e * 0.125 * 2 + 5; // croches pointées pour respirer
  if (t >= 26) break;
  bassNote(t, pat[e % 8], 0.18);
}

// Risers vers les grosses entrées
add(19.0, 1.0, (ts, p) => rnd() * 2 * p * p * 0.38); // -> payoff
add(4.0, 1.0, (ts, p) => rnd() * 2 * p * p * 0.22); // -> beat50

// Impacts SUR les coupes
impact(3.0, 0.8);
impact(5.0, 0.85);
impact(10.0, 0.85);
impact(15.0, 0.85);
impact(20.0, 0.95);
impact(26.5, 0.6); // CTA plus doux

// Shimmer du CTA : cluster aigu qui s'éteint
add(27.0, 2.4, (ts, p) => {
  const env = Math.sin(Math.PI * Math.min(1, p * 1.05)) ** 2;
  return (
    (Math.sin(2 * Math.PI * 1318.5 * ts) +
      Math.sin(2 * Math.PI * 1568 * ts) * 0.7 +
      Math.sin(2 * Math.PI * 2093 * ts) * 0.4) *
    env *
    0.03
  );
});

// Normalisation
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(out[i]));
const g = 0.9 / peak;
const buf = Buffer.alloc(44 + N * 2);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + N * 2, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(1, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 2, 28);
buf.writeUInt16LE(2, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++)
  buf.writeInt16LE(
    Math.round(Math.max(-1, Math.min(1, out[i] * g)) * 32767),
    44 + i * 2,
  );
writeFileSync(join(OUT, "track.wav"), buf);
console.log("track.wav écrit, pic", peak.toFixed(2));

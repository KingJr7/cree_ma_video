// Beat Amapiano 40 s @ 100 BPM — déterministe, zéro asset externe.
//   1 beat = 0.6 s
//   kicks 808 sur 1 et 3 de chaque mesure
//   log drum (sub thump) sur 2 et 4
//   shakers 16e (double-hit, ouvert-fermé)
//   congas sur le 16e offbeat
//   pad d'ambiance (nappe filtrée)
// Dérivé du squelette examples/scripts/gen-track.mjs du skill.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const DUR = 40;
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

// Soft saturation (tanh) pour donner de la chaleur
const sat = (x) => Math.tanh(x * 1.1);

// --- Voix ---
// 808 kick : pitch down, sine, click transient
const kick = (t, gain = 1) =>
  add(t, 0.45, (ts, p) => {
    const f = 110 - 90 * Math.min(1, ts * 9);
    const click = ts < 0.005 ? rnd() * 0.6 * (1 - ts / 0.005) : 0;
    const env = Math.exp(-p * 5.5);
    return sat(Math.sin(2 * Math.PI * f * ts) * env * 0.95 * gain + click * env * 0.4);
  });

// log drum (sub thump) : sine 50 Hz avec pitch up très court
const logDrum = (t, gain = 1) =>
  add(t, 0.32, (ts, p) => {
    const f = 80 + 60 * Math.exp(-ts * 30);
    const env = Math.min(1, ts * 70) * Math.exp(-p * 4.5);
    return sat(Math.sin(2 * Math.PI * f * ts) * env * 0.9 * gain);
  });

// shaker (16e) : bruit passe-haut très court
const shaker = (t, open = false, gain = 1) =>
  add(t, 0.08, (ts, p) => {
    const x = rnd();
    const env = Math.exp(-p * (open ? 18 : 30));
    return x * env * 0.35 * gain;
  });

// conga (tom mid) : pitché
const conga = (t, f = 220, gain = 1) =>
  add(t, 0.18, (ts, p) => {
    const env = Math.min(1, ts * 60) * Math.exp(-p * 7);
    return sat(Math.sin(2 * Math.PI * f * ts) * env * 0.55 * gain);
  });

// pad (nappe) : 2 sinusoïdes filtrées très douces
const pad = (t, f, dur, gain = 0.18) =>
  add(t, dur, (ts, p) => {
    const env = Math.min(1, ts * 6) * Math.min(1, (dur - ts) * 6);
    return sat(
      (Math.sin(2 * Math.PI * f * ts) * 0.6 + Math.sin(2 * Math.PI * f * 1.5 * ts) * 0.2 + Math.sin(2 * Math.PI * f * 0.5 * ts) * 0.3) *
        env *
        gain,
    );
  });

// Pluck mélodique
const pluck = (t, f, dur = 0.18, gain = 0.4) =>
  add(t, dur, (ts, p) => {
    const env = Math.exp(-p * 8);
    return sat(Math.sin(2 * Math.PI * f * ts) * env * gain);
  });

// --- Pattern ---
// Mesure = 4 beats = 2.4 s. 40s = 16.67 mesures
const BPM = 100;
const BEAT = 60 / BPM; // 0.6 s
const SIXTEENTH = BEAT / 4; // 0.15 s
const NUM_MEASURES = Math.floor(DUR / (BEAT * 4));
const start = (m, b) => m * BEAT * 4 + b * BEAT;
const s16 = (m, b, sub) => m * BEAT * 4 + b * BEAT + sub * SIXTEENTH;

// Pattern Amapiano-ish : kick sur 1, log drum sur 3, shakers constants, congas syncopés
// Mélodie : pentatonique Am (A, C, D, E, G) sur 2 octaves
const SCALE = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 783.99];
const MELODY = [
  // mesure 0-3 : intro douce
  [3, 0], [3, 2], [4, 0], [3, 4],
  // 4-7
  [3, 2], [3, 0], [4, 4], [5, 0],
  // 8-11
  [3, 0], [4, 2], [3, 4], [4, 0],
  // 12-15
  [5, 2], [4, 4], [3, 0], [4, 2],
];

for (let m = 0; m < NUM_MEASURES; m++) {
  // kick sur 1 et 3
  kick(start(m, 0), 1);
  kick(start(m, 2), 0.85);

  // log drum sur 2 et 4
  logDrum(start(m, 1), 1);
  logDrum(start(m, 3), 0.95);

  // shakers 16e : pattern typique
  for (let b = 0; b < 4; b++) {
    shaker(s16(m, b, 0), false);
    shaker(s16(m, b, 1), true, 0.5);
    shaker(s16(m, b, 2), false);
    shaker(s16(m, b, 3), true, 0.5);
  }

  // congas syncopés
  if (m % 2 === 0) conga(s16(m, 2, 2), 180, 0.8);
  if (m % 2 === 1) conga(s16(m, 1, 3), 240, 0.8);
  if (m % 4 === 2) conga(s16(m, 3, 2), 260, 0.6);

  // pad : accords qui changent toutes les 4 mesures
  const padNote = [110, 130.81, 146.83, 98, 110, 130.81, 146.83, 110][m % 8];
  pad(start(m, 0), padNote, BEAT * 4, 0.14);

  // mélodie : un pluck par beat
  const mIdx = m % MELODY.length;
  const [beat, note] = MELODY[mIdx];
  pluck(s16(m, beat, 0), SCALE[note % SCALE.length], 0.32, 0.32);
  if (m > 4) {
    // deuxième note en offset
    pluck(s16(m, (beat + 2) % 4, 2), SCALE[(note + 2) % SCALE.length], 0.28, 0.22);
  }
}

// Master : soft limiter pour éviter la saturation excessive
let peak = 0;
for (let i = 0; i < N; i++) if (Math.abs(out[i]) > peak) peak = Math.abs(out[i]);
const norm = peak > 0 ? 0.85 / peak : 1;
for (let i = 0; i < N; i++) out[i] *= norm;

writeFileSync(join(OUT, "amapiano.wav"), wav(out));

function wav(samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
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
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  return buf;
}

console.log("Amapiano track écrit :", join(OUT, "amapiano.wav"));

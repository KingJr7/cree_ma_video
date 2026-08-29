// Synthétise un kit SFX minimal en WAV mono 16-bit — zéro asset externe.
// Dérivé de examples/scripts/gen-sfx.mjs du skill remotion-motion-graphics.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sfx");
mkdirSync(OUT, { recursive: true });

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

const secs = (s) => Math.round(s * SR);

// whoosh — burst de bruit filtré passe-bas, swell puis mort
{
  const N = secs(0.4);
  const out = new Float32Array(N);
  let lp = 0;
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647 - 0.5;
  };
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const env = Math.sin(Math.PI * Math.pow(t, 0.7)) ** 2;
    const cutoff = 0.05 + 0.25 * Math.sin(Math.PI * t);
    lp += cutoff * (rnd() * 2 - lp);
    out[i] = lp * env * 0.9;
  }
  writeFileSync(join(OUT, "whoosh.wav"), wav(out));
}

// pop — sinus à chute rapide de hauteur
{
  const N = secs(0.14);
  const out = new Float32Array(N);
  let phase = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const f = 700 - 380 * t;
    phase += (2 * Math.PI * f) / SR;
    out[i] = Math.sin(phase) * Math.exp(-t * 9) * 0.8;
  }
  writeFileSync(join(OUT, "pop.wav"), wav(out));
}

// tick — petit blip aigu
{
  const N = secs(0.05);
  const out = new Float32Array(N);
  let phase = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    phase += (2 * Math.PI * 1900) / SR;
    out[i] = Math.sin(phase) * Math.exp(-t * 14) * 0.5;
  }
  writeFileSync(join(OUT, "tick.wav"), wav(out));
}

// bass — frappe grave, thump de sine
{
  const N = secs(0.45);
  const out = new Float32Array(N);
  let phase = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const f = 85 - 25 * t;
    phase += (2 * Math.PI * f) / SR;
    out[i] = Math.sin(phase) * Math.exp(-t * 6) * 0.95;
  }
  writeFileSync(join(OUT, "bass.wav"), wav(out));
}

// click — UI : bruit très court passe-haut, ambiance "tap"
{
  const N = secs(0.06);
  const out = new Float32Array(N);
  let prev = 0;
  let seed = 11;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647 - 0.5;
  };
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const x = rnd();
    const hp = x - prev;
    prev = x;
    out[i] = hp * Math.exp(-t * 30) * 0.6;
  }
  writeFileSync(join(OUT, "click.wav"), wav(out));
}

// success — arpège ascendant (C5, E5, G5) qui finit en cloche
{
  const N = secs(0.7);
  const out = new Float32Array(N);
  const notes = [523.25, 659.25, 783.99, 1046.5];
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const noteIndex = Math.min(notes.length - 1, Math.floor(t * 4));
    const localT = (t * 4) - noteIndex;
    const f = notes[noteIndex];
    const env = Math.exp(-localT * 6) * (1 - t);
    let s = Math.sin(2 * Math.PI * f * i / SR) * env * 0.5;
    // petite harmonique
    s += Math.sin(2 * Math.PI * f * 2 * i / SR) * env * 0.2;
    out[i] = s;
  }
  writeFileSync(join(OUT, "success.wav"), wav(out));
}

// chime — sweep ascendant, "magic"
{
  const N = secs(0.5);
  const out = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const f = 400 + 1600 * t;
    out[i] = Math.sin(2 * Math.PI * f * i / SR) * Math.exp(-t * 4) * 0.4;
  }
  writeFileSync(join(OUT, "chime.wav"), wav(out));
}

// cash — ker-ching (deux notes : clac métallique + résonance)
{
  const N = secs(0.6);
  const out = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const f1 = 1800;
    const f2 = 2400;
    const env1 = Math.exp(-t * 28);
    const env2 = Math.exp(-t * 8) * (t > 0.05 ? 1 : t / 0.05);
    out[i] = (Math.sin(2 * Math.PI * f1 * i / SR) * env1 + Math.sin(2 * Math.PI * f2 * i / SR) * env2) * 0.45;
  }
  writeFileSync(join(OUT, "cash.wav"), wav(out));
}

// shutter — déclic photo (bruit court filtré)
{
  const N = secs(0.12);
  const out = new Float32Array(N);
  let seed = 23;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647 - 0.5;
  };
  let lp = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    lp += 0.4 * (rnd() - lp);
    const env = Math.sin(Math.PI * t);
    out[i] = lp * env * 0.8;
  }
  writeFileSync(join(OUT, "shutter.wav"), wav(out));
}

// swoosh — whoosh inverse (descendante) pour transitions
{
  const N = secs(0.5);
  const out = new Float32Array(N);
  let lp = 0;
  let seed = 31;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647 - 0.5;
  };
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const env = Math.sin(Math.PI * t);
    const cutoff = 0.3 - 0.25 * t;
    lp += cutoff * (rnd() * 2 - lp);
    out[i] = lp * env * 0.85;
  }
  writeFileSync(join(OUT, "swoosh.wav"), wav(out));
}

// pop2 — pop plus brillant que pop.wav (montée de fréquence)
{
  const N = secs(0.12);
  const out = new Float32Array(N);
  let phase = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const f = 900 + 800 * t;
    phase += (2 * Math.PI * f) / SR;
    out[i] = Math.sin(phase) * Math.exp(-t * 12) * 0.7;
  }
  writeFileSync(join(OUT, "pop2.wav"), wav(out));
}

console.log("SFX écrits dans", OUT);

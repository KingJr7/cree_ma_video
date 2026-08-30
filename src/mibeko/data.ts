// Mibeko — données de scènes + timings depuis la transcription word-synced.
import vo from "../../public/mibeko-vo.json";

export type Word = { t: string; s: number; e: number };

export const WORDS: Word[] = vo.words;

export type Scene = {
  id: string;
  img: string;
  from: number; // index du premier mot
  to: number; // index du dernier mot
  eyebrow?: string;
  pill?: string; // texte_ecran
  firstMs: number; // ms du premier mot
  lastMs: number; // ms de fin du dernier mot
};

// Plages d'index par chapitre (issues de la transcription).
type Range = [string, number, number, string, string | undefined, string];
const RANGES: Range[] = [
  // id, fromIdx, toIdx, img, pill(texte_ecran), eyebrow
  ["hook", 0, 13, "hook.jpeg", undefined, "MIBEKO"],
  ["tension", 14, 25, "tension.jpeg", undefined, "LE PROBLÈME"],
  ["step1", 26, 41, "step1.jpeg", "MIBEKO : tes droits dans ta poche", "LA SOLUTION"],
  ["step2", 42, 54, "step2.jpeg", "Une IA 100% congolaise", "L'IA"],
  ["step3", 55, 65, "step3.jpeg", "L'article exact pour te défendre", "LA LOI"],
  ["payoff", 66, 72, "payoff.jpeg", undefined, "LE RÉSULTAT"],
  ["cta", 73, 79, "cta.jpeg", undefined, "TÉLÉCHARGE"],
];

export const SCENES: Scene[] = RANGES.map(([id, from, to, img, pill, eyebrow]) => ({
  id,
  from,
  to,
  img,
  pill,
  eyebrow,
  firstMs: WORDS[from].s,
  lastMs: WORDS[to].e,
}));

// Détermine la scène active à un instant ms donné (combler les silences avec la plus proche).
export function sceneAt(ms: number): Scene {
  for (let i = 0; i < SCENES.length; i++) {
    const s = SCENES[i];
    const prevEnd = i === 0 ? 0 : SCENES[i - 1].lastMs;
    if (ms >= prevEnd && ms < s.lastMs) return s;
    if (i === SCENES.length - 1 && ms >= s.lastMs) return s;
  }
  return SCENES[0];
}

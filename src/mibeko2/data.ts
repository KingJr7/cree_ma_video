// Mibeko2 — sections bicolores + plan média (photos/vidéos Pexels) + karaoké word-sync.
import vo from "../../public/ca-vo.json";

export type Word = { t: string; s: number; e: number };

// Corrections de mots (la transcription a des erreurs vs le script).
const OVERRIDE: Record<number, string> = { 32: "SMIG", 74: "Mibeko", 86: "LOI" };

export const WORDS: Word[] = vo.words.map((w, i) => ({
  t: OVERRIDE[i] ?? w.t,
  s: w.s,
  e: w.e,
}));

export type Media = { kind: "img" | "vid"; src: string; from: number; to: number };
export type Section = {
  id: string;
  bg: string;
  from: number;
  to: number;
  words: number[];
  media: Media[];
};

// Frames @30fps. Bornes déduites des timestamps de la transcription (voiceca.mp3).
const S: [string, number, number, number[], string][] = [
  ["S0", 0, 200, [0, 1, 2, 3, 4, 5, 6, 7, 8], "#000000"], // hook
  ["S1", 200, 291, [9, 10, 11, 12, 13, 14, 15, 16, 17, 18], "#FFFFFF"], // tension
  ["S2", 291, 445, [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], "#000000"], // step1 45 000
  ["S3", 445, 614, [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42], "#FFFFFF"], // step2 SMIG vs 45 000
  ["S4", 614, 772, [43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54], "#000000"], // step3 IA
  ["S5", 772, 874, [55, 56, 57, 58, 59, 60, 61, 62, 63, 64], "#FFFFFF"], // step4 article loi
  ["S6", 874, 994, [65, 66, 67, 68, 69, 70, 71, 72, 73], "#000000"], // payoff
  ["S7", 994, 1158, [74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86], "#FFFFFF"], // cta
];

const MEDIA_PLAN: Record<string, Media[]> = {
  S0: [{ kind: "vid", src: "vids/mibeko2/hook-0.mp4", from: 0, to: 200 }],
  S1: [{ kind: "vid", src: "vids/mibeko2/tension-0.mp4", from: 200, to: 291 }],
  S2: [
    { kind: "vid", src: "vids/mibeko2/step1-0.mp4", from: 291, to: 360 },
    { kind: "img", src: "imgs/mibeko2/step1-1.jpeg", from: 360, to: 445 },
  ],
  S3: [
    { kind: "vid", src: "vids/mibeko2/step2-0.mp4", from: 445, to: 529 },
    { kind: "img", src: "imgs/mibeko2/step2-1.jpeg", from: 529, to: 614 },
  ],
  S4: [
    { kind: "vid", src: "vids/mibeko2/step3-0.mp4", from: 614, to: 693 },
    { kind: "img", src: "imgs/mibeko2/step3-1.jpeg", from: 693, to: 772 },
  ],
  S5: [{ kind: "vid", src: "vids/mibeko2/step4-0.mp4", from: 772, to: 874 }],
  S6: [{ kind: "vid", src: "vids/mibeko2/payoff-0.mp4", from: 874, to: 994 }],
  S7: [
    { kind: "vid", src: "vids/mibeko2/cta-0.mp4", from: 994, to: 1076 },
    { kind: "img", src: "imgs/mibeko2/cta-1.jpeg", from: 1076, to: 1158 },
  ],
};

export const SECTIONS: Section[] = S.map(([id, from, to, words, bg]) => ({
  id,
  from,
  to,
  words,
  bg,
  media: MEDIA_PLAN[id],
}));

export function sectionAt(frame: number): Section {
  return SECTIONS.find((s) => frame >= s.from && frame < s.to) ?? SECTIONS[SECTIONS.length - 1];
}

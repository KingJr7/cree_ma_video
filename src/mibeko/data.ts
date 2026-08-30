// Mibeko v2 — sections bicolores (noir/blanc, cut direct) + plan média (photos/vidéos Pexels)
// + karaoké mot par mot synchronisé sur la transcription word-synced.
import vo from "../../public/mibeko-vo.json";

export type Word = { t: string; s: number; e: number };
export const WORDS: Word[] = vo.words;

export type Media = { kind: "img" | "vid"; src: string; from: number; to: number };
export type Section = {
  id: string;
  bg: string; // "#000000" | "#FFFFFF"
  from: number; // frame où le fond cut (apparition)
  to: number; // frame où il cut (disparition)
  words: number[]; // indices WORDS couverts
  media: Media[];
};

// Frames @ 30fps. Bornes déduites des timestamps de la transcription.
const S: [string, number, number, number[], string][] = [
  // id, fromFrame, toFrame, wordIdx[], bg
  ["S0", 0, 97, [0, 1, 2, 3, 4, 5, 6, 7, 8], "#000000"],
  ["S1", 97, 148, [9, 10, 11, 12, 13], "#FFFFFF"],
  ["S2", 148, 270, [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], "#000000"],
  ["S3", 270, 319, [26, 27, 28], "#FFFFFF"],
  ["S4", 319, 444, [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41], "#000000"],
  ["S5", 444, 574, [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54], "#FFFFFF"],
  ["S6", 574, 706, [55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65], "#000000"],
  ["S7", 706, 829, [66, 67, 68, 69, 70, 71, 72], "#FFFFFF"],
  ["S8", 829, 948, [73, 74, 75, 76, 77, 78, 79], "#000000"],
];

// Plan média (photos/vidéos Pexels) — centres à 0.45 de haut, sticker arrondi.
const MEDIA_PLAN: Record<string, Media[]> = {
  S0: [{ kind: "vid", src: "vids/mibeko/hook-0.mp4", from: 0, to: 97 }],
  S1: [{ kind: "img", src: "imgs/mibeko/hook-1.jpeg", from: 97, to: 148 }],
  S2: [
    { kind: "vid", src: "vids/mibeko/tension-0.mp4", from: 148, to: 209 },
    { kind: "img", src: "imgs/mibeko/tension-1.jpeg", from: 209, to: 270 },
  ],
  S3: [{ kind: "img", src: "imgs/mibeko/step1-2.jpeg", from: 270, to: 319 }],
  S4: [
    { kind: "vid", src: "vids/mibeko/step1-0.mp4", from: 319, to: 381 },
    { kind: "img", src: "imgs/mibeko/step1-1.jpeg", from: 381, to: 444 },
  ],
  S5: [
    { kind: "vid", src: "vids/mibeko/step2-0.mp4", from: 444, to: 509 },
    { kind: "img", src: "imgs/mibeko/step2-1.jpeg", from: 509, to: 574 },
  ],
  S6: [
    { kind: "vid", src: "vids/mibeko/step3-0.mp4", from: 574, to: 640 },
    { kind: "img", src: "imgs/mibeko/step3-1.jpeg", from: 640, to: 706 },
  ],
  S7: [{ kind: "vid", src: "vids/mibeko/payoff-0.mp4", from: 706, to: 829 }],
  S8: [
    { kind: "vid", src: "vids/mibeko/cta-0.mp4", from: 829, to: 888 },
    { kind: "img", src: "imgs/mibeko/cta-1.jpeg", from: 888, to: 948 },
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

// Section active à une frame donnée.
export function sectionAt(frame: number): Section {
  return SECTIONS.find((s) => frame >= s.from && frame < s.to) ?? SECTIONS[SECTIONS.length - 1];
}

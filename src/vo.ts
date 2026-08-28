import vo from "../public/vo.json";

export type VoWord = { t: string; s: number; e: number };
export const WORDS: VoWord[] = vo.words;

export const msToFrame = (ms: number, fps = 30) => Math.round((ms / 1000) * fps);

// Pages de captions : groupes de mots lisibles, avec fenêtre temporelle.
export type Page = { words: VoWord[]; start: number; end: number };
const WORDS_PER_PAGE = 6;
export const PAGES: Page[] = [];
for (let i = 0; i < WORDS.length; i += WORDS_PER_PAGE) {
  const slice = WORDS.slice(i, i + WORDS_PER_PAGE);
  PAGES.push({
    words: slice,
    start: slice[0].s,
    end: slice[slice.length - 1].e,
  });
}

// Le mot actif à un instant ms donné.
export const wordActiveAt = (ms: number, page: Page) =>
  page.words.find((w) => ms >= w.s && ms <= w.e) ?? page.words[0];

// Mibeko — Pexels images (9:16 portrait) in public/imgs/mibeko/. Run LOCALLY; key never committed.
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const KEY = readFileSync(".env", "utf8").match(/PEXELS_API_KEY=(\S+)/)?.[1];
if (!KEY) throw new Error("PEXELS_API_KEY manquante");

const QUERIES = {
  hook: "serious african man portrait face",
  tension: "african city street people",
  step1: "african man holding smartphone",
  step2: "typing on smartphone fingers screen",
  step3: "law books justice",
  payoff: "confident african man arms crossed",
  cta: "person holding phone hand",
};

mkdirSync("public/imgs/mibeko", { recursive: true });

for (const [name, query] of Object.entries(QUERIES)) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=portrait`;
  const res = await fetch(url, { headers: { Authorization: KEY } });
  const j = await res.json();
  if (!j.photos || j.photos.length === 0) {
    console.log("  !", name, "aucune photo");
    continue;
  }
  const imgUrl = j.photos[0].src.large2x;
  const img = await (await fetch(imgUrl)).arrayBuffer();
  const ext = basename(new URL(imgUrl).pathname).split(".").pop() || "jpg";
  const path = `public/imgs/mibeko/${name}.${ext}`;
  writeFileSync(path, Buffer.from(img));
  console.log("  ok", name, "->", path, Buffer.from(img).length, "octets");
}
console.log("terminé");

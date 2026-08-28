// Télécharge des illustrations Pexels (portrait) dans public/images/ — exécuté en LOCAL,
// la clé ne doit JAMAIS être committée. Peut être relancé librement (déterministe côté noms).
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const KEY = readFileSync(".env", "utf8").match(/PEXELS_API_KEY=(\S+)/)?.[1];
if (!KEY) throw new Error("PEXELS_API_KEY manquante");

const QUERIES = {
  hook_door: "apartment building entrance door",
  court: "judge gavel law court justice",
  water: "water tap faucet",
  electricity: "electric meter",
  lock: "door lock",
  handshake: "tenant landlord handshake rental",
};

mkdirSync("public/images", { recursive: true });

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
  const path = `public/images/${name}.${ext}`;
  writeFileSync(path, Buffer.from(img));
  console.log("  ok", name, "->", path, Buffer.from(img).length, "octets");
}
console.log("terminé");

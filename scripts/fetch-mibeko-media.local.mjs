// Mibeko v2 — Pexels photos + vidéos (portrait). Run LOCAL; key never committed.
// Images -> public/imgs/mibeko/<scene>-<n>.jpg
// Vidéos -> public/vids/mibeko/<scene>-<n>.mp4
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const KEY = readFileSync(".env", "utf8").match(/PEXELS_API_KEY=(\S+)/)?.[1];
if (!KEY) throw new Error("PEXELS_API_KEY manquante");
const H = { Authorization: KEY };

const N_IMGS = 3; // photos par scène
const N_VIDS = 2; // vidéos par scène

const QUERIES = {
  hook: ["african man serious face", "boss angry pointing", "tenant landlord argument"],
  tension: ["african city street crowd", "confused african man", "african neighborhood walking"],
  step1: ["african man holding smartphone", "phone in hand closeup", "man looking at phone"],
  step2: ["typing smartphone fingers", "african woman on phone", "phone chat hands"],
  step3: ["law books justice", "gavel judge", "document legal paper"],
  payoff: ["confident african man arms", "african woman smiling", "handshake agreement"],
  cta: ["person holding phone hand", "download app phone", "phone app store hand"],
};

const SRC = (sp, name) => {
  const base = sp.src.large2x;
  const ext = basename(new URL(base).pathname).split(".").pop() || "jpg";
  return [sp.id, base, ext];
};

mkdirSync("public/imgs/mibeko", { recursive: true });
mkdirSync("public/vids/mibeko", { recursive: true });

const all = [];
for (const [scene, qs] of Object.entries(QUERIES)) {
  // Photos
  const qPhotos = query => `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=8&orientation=portrait`;
  let photoGot = 0;
  for (const q of qs) {
    if (photoGot >= N_IMGS) break;
    const res = await fetch(qPhotos(q), { headers: H });
    const j = await res.json();
    if (!j.photos || j.photos.length === 0) continue;
    for (const sp of j.photos) {
      if (photoGot >= N_IMGS) break;
      const [id, base, ext] = SRC(sp, {});
      const path = `public/imgs/mibeko/${scene}-${photoGot}.${ext}`;
      const buf = Buffer.from(await (await fetch(base)).arrayBuffer());
      writeFileSync(path, buf);
      all.push({ scene, kind: "img", n: photoGot, file: path, bytes: buf.length });
      photoGot++;
    }
  }
  // Vidéos
  const vRes = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(qs[0])}&per_page=6&orientation=portrait`, { headers: H });
  const vj = await vRes.json();
  let videoGot = 0;
  if (vj.videos) {
    for (const vv of vj.videos) {
      if (videoGot >= N_VIDS) break;
      // prendre un fichier portrait raisonnable (hauteur >= ? , priorité basse taille)
      const files = (vv.video_files || []).filter(f => f.height && f.width < f.height);
      files.sort((a, b) => (a.height || 0) - (b.height || 0));
      const vf = files.find(f => (f.height || 0) >= 480) || files[0] || vv.video_files?.[0];
      if (!vf?.link) continue;
      const buf = Buffer.from(await (await fetch(vf.link)).arrayBuffer());
      if (buf.length > 6_000_000) continue; // skip trop gros
      const path = `public/vids/mibeko/${scene}-${videoGot}.mp4`;
      writeFileSync(path, buf);
      all.push({ scene, kind: "vid", n: videoGot, file: path, bytes: buf.length });
      videoGot++;
    }
  }
  console.log(`  ${scene}: ${photoGot} imgs, ${videoGot} vids`);
}

// meta JSON sans secrets, commitée pour info
writeFileSync("public/mibeko-media.json", JSON.stringify(all, null, 2));
console.log("terminé — total médias:", all.length);

// Mibeko2 — Pexels photos + vidéos (portrait). Run LOCAL; key never committed.
// Images -> public/imgs/mibeko2/<scene>-<n>.jpg   Vidéos -> public/vids/mibeko2/<scene>-<n>.mp4
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const KEY = readFileSync(".env", "utf8").match(/PEXELS_API_KEY=(\S+)/)?.[1];
if (!KEY) throw new Error("PEXELS_API_KEY manquante");
const H = { Authorization: KEY };

const N_IMGS = 3;
const N_VIDS = 2;

const QUERIES = {
  hook: ["counting money cash hand", "cyan african francs", "currency bills"],
  tension: ["confused african man", "doubting woman thinking", "worried african worker"],
  step1: ["counting cash counter shop", "money on counter business", "african shopkeeper"],
  step2: ["stack of banknotes", "money bills closeup", "counting money", "cash money"],
  step3: ["typing smartphone hands", "phone chat app", "african holding phone"],
  step4: ["law book scale justice", "legal document gavel", "contract signing"],
  payoff: ["happy african woman", "satisfied worker smiling", "agreement handshake money"],
  cta: ["phone on hand stores", "smartphone app hand", "download app phone"],
};

mkdirSync("public/imgs/mibeko2", { recursive: true });
mkdirSync("public/vids/mibeko2", { recursive: true });
const all = [];

for (const [scene, qs] of Object.entries(QUERIES)) {
  let photoGot = 0;
  for (const q of qs) {
    if (photoGot >= N_IMGS) break;
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=8&orientation=portrait`, { headers: H });
    const j = await res.json();
    if (!j.photos || j.photos.length === 0) continue;
    for (const sp of j.photos) {
      if (photoGot >= N_IMGS) break;
      const base = sp.src.large2x;
      const ext = basename(new URL(base).pathname).split(".").pop() || "jpg";
      const path = `public/imgs/mibeko2/${scene}-${photoGot}.${ext}`;
      const buf = Buffer.from(await (await fetch(base)).arrayBuffer());
      writeFileSync(path, buf);
      all.push({ scene, kind: "img", n: photoGot, file: path, bytes: buf.length });
      photoGot++;
    }
  }
  const vRes = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(qs[0])}&per_page=6&orientation=portrait`, { headers: H });
  const vj = await vRes.json();
  let videoGot = 0;
  if (vj.videos) {
    for (const vv of vj.videos) {
      if (videoGot >= N_VIDS) break;
      const files = (vv.video_files || []).filter(f => f.height && f.width < f.height);
      files.sort((a,b)=>(a.height||0)-(b.height||0));
      const vf = files.find(f=>(f.height||0)>=480) || files[0] || vv.video_files?.[0];
      if (!vf?.link) continue;
      const buf = Buffer.from(await (await fetch(vf.link)).arrayBuffer());
      if (buf.length > 6_000_000) continue;
      const path = `public/vids/mibeko2/${scene}-${videoGot}.mp4`;
      writeFileSync(path, buf);
      all.push({ scene, kind: "vid", n: videoGot, file: path, bytes: buf.length });
      videoGot++;
    }
  }
  console.log(`  ${scene}: ${photoGot} imgs, ${videoGot} vids`);
}
writeFileSync("public/mibeko2-media.json", JSON.stringify(all,null,2));
console.log("terminé — total:", all.length);

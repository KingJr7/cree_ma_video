// Transcrit voiceca.mp3 via AssemblyAI -> public/ca-vo.json (mots + timestamps ms)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const KEY = readFileSync(".env", "utf8").match(/ASSEMBLYAI_API_KEY=(\S+)/)?.[1];
if (!KEY) throw new Error("ASSEMBLYAI_API_KEY manquante");
const H = { authorization: KEY };
const audio = readFileSync("voiceca.mp3");

const up = await fetch("https://api.assemblyai.com/v2/upload", { method: "POST", headers: { ...H, "content-type": "application/octet-stream" }, body: audio });
const { upload_url } = await up.json();
if (!upload_url) throw new Error("upload failed: " + up.status);

const cr = await fetch("https://api.assemblyai.com/v2/transcript", { method: "POST", headers: { ...H, "content-type": "application/json" }, body: JSON.stringify({ audio_url: upload_url, language_code: "fr" }) });
const { id } = await cr.json();
if (!id) throw new Error("create failed");

let tr;
for (;;) { await new Promise(r=>setTimeout(r,3000)); const res=await fetch(`https://api.assemblyai.com/v2/transcript/${id}`,{headers:H}); tr=await res.json(); if(tr.status==="completed"||tr.status==="error")break; process.stdout.write("."); }
if (tr.status==="error") throw new Error("transcription error: "+tr.error);

mkdirSync("public",{recursive:true});
const words=tr.words.map(w=>({t:w.text,s:w.start,e:w.end}));
writeFileSync("public/ca-vo.json", JSON.stringify({text:tr.text,words,confidence:tr.confidence},null,2));
console.log("\nOK — nb mots:",words.length);
console.log(tr.text);

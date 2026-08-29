import React, { useMemo } from "react";
import { theme } from "./theme";

// Génère une matrice 25x25 de modules (0/1) à partir d'une seed string.
// Visuellement crédible : 3 finder patterns aux 3 coins, motif de données
// pseudo-aléatoire au centre. Non scannable mais immédiatement lisible comme QR.
const N = 25;

const findMatrix = (seed: string) => {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) | 0;
  const m: number[][] = [];
  for (let r = 0; r < N; r++) {
    m.push([]);
    for (let c = 0; c < N; c++) m[r].push(((s * 9301 + 49297 + r * 31 + c * 7) % 233280) % 2);
  }
  return m;
};

const stampFinder = (m: number[][], r0: number, c0: number) => {
  for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
    const on = r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
    m[r0 + r][c0 + c] = on ? 1 : 0;
  }
  // marge blanche autour du finder
  for (let r = -1; r < 8; r++) for (let c = -1; c < 8; c++) {
    const rr = r0 + r, cc = c0 + c;
    if (rr < 0 || cc < 0 || rr >= N || cc >= N) continue;
    const inFinder = r >= 0 && r < 7 && c >= 0 && c < 7;
    if (!inFinder) continue;
    if (r === -1 || r === 7 || c === -1 || c === 7) m[rr][cc] = 0;
  }
  // séparer
};

const stampAlignment = (m: number[][], r0: number, c0: number) => {
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
    const on = r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2);
    m[r0 + r][c0 + c] = on ? 1 : 0;
  }
};

export const QRCode: React.FC<{ seed: string; size?: number; fg?: string; bg?: string }> = ({
  seed,
  size = 240,
  fg = theme.colors.onyx,
  bg = theme.colors.bg,
}) => {
  const matrix = useMemo(() => {
    const m = findMatrix(seed);
    stampFinder(m, 0, 0);
    stampFinder(m, 0, N - 7);
    stampFinder(m, N - 7, 0);
    // 2 patterns d'alignement discrets
    stampAlignment(m, N - 9, N - 9);
    // bande de timing (alternée) entre finders
    for (let i = 8; i < N - 8; i++) m[6][i] = i % 2 === 0 ? 1 : 0;
    for (let i = 8; i < N - 8; i++) m[i][6] = i % 2 === 0 ? 1 : 0;
    return m;
  }, [seed]);

  const cell = size / N;
  return (
    <div
      style={{
        width: size,
        height: size,
        background: bg,
        padding: cell * 1.4,
        borderRadius: 16,
        boxShadow: theme.shadow.card,
      }}
    >
      <svg width={size - cell * 2.8} height={size - cell * 2.8} viewBox={`0 0 ${N} ${N}`}>
        {matrix.map((row, r) =>
          row.map((v, c) =>
            v ? <rect key={`${r}-${c}`} x={c} y={r} width={1.02} height={1.02} fill={fg} /> : null,
          ),
        )}
      </svg>
    </div>
  );
};

// Timeline calée sur les timestamps réels de la voix off (public/vo.json).
// Chaque "chunk" = une plage de mots + kicker + images à faire apparaître.
// msToFrame convertit les timestamps en frames @ FPS.
export const FPS = 30;
export const msToFrame = (ms: number) => Math.round((ms / 1000) * FPS);

export type Chunk = {
  id: string;
  from: number; // frame de début (premier mot)
  duration: number; // frames (jusqu'au prochain chunk / linger)
  kicker: string;
  cards: { img: string; from: number; duration: number; zoom: number; side: -1 | 1 }[];
};

const F = msToFrame;

// frontières (ms) : début/fin des phrases, avec un léger linger entre chaque
const B = {
  c1: [16, 4220],
  c2: [4270, 7560],
  c3: [7560, 12220],
  c4: [11820, 15740],
  c5: [15610, 18280],
  c6: [18420, 20140],
  c7: [20010, 30000],
};

export const CHUNKS: Chunk[] = [
  {
    id: "c1",
    from: F(B.c1[0]),
    duration: F(B.c1[1]) - F(B.c1[0]),
    kicker: "Congo · droit du logement",
    cards: [
      { img: "images/hook_door.jpeg", from: F(600), duration: F(B.c1[1]) - F(600), zoom: 1.12, side: 1 },
    ],
  },
  {
    id: "c2",
    from: F(B.c2[0]),
    duration: F(B.c2[1]) - F(B.c2[0]),
    kicker: "Selon la loi",
    cards: [
      { img: "images/court.jpeg", from: F(B.c2[0] + 400), duration: F(B.c2[1]) - F(B.c2[0] + 400), zoom: 1.08, side: -1 },
    ],
  },
  {
    id: "c3",
    from: F(B.c3[0]),
    duration: F(B.c3[1]) - F(B.c3[0]),
    kicker: "Une décision de justice",
    cards: [
      { img: "images/court.jpeg", from: F(B.c3[0] + 400), duration: F(B.c3[1]) - F(B.c3[0] + 400), zoom: 1.14, side: 1 },
    ],
  },
  {
    id: "c4",
    from: F(B.c4[0]),
    duration: F(B.c4[1]) - F(B.c4[0]),
    kicker: "Interdit de couper",
    cards: [
      { img: "images/water.jpeg", from: F(B.c4[0] + 300), duration: F(14100) - F(B.c4[0] + 300), zoom: 1.1, side: -1 },
      { img: "images/electricity.jpeg", from: F(14000), duration: F(B.c4[1]) - F(14000), zoom: 1.12, side: 1 },
    ],
  },
  {
    id: "c5",
    from: F(B.c5[0]),
    duration: F(B.c5[1]) - F(B.c5[0]),
    kicker: "Interdit de changer",
    cards: [
      { img: "images/lock.jpeg", from: F(B.c5[0] + 400), duration: F(B.c5[1]) - F(B.c5[0] + 400), zoom: 1.08, side: -1 },
    ],
  },
  {
    id: "c6",
    from: F(B.c6[0]),
    duration: F(B.c6[1]) - F(B.c6[0]),
    kicker: "Le logeur en faute",
    cards: [
      { img: "images/handshake.jpeg", from: F(B.c6[0] + 300), duration: F(B.c6[1]) - F(B.c6[0] + 300), zoom: 1.1, side: 1 },
    ],
  },
  {
    id: "c7",
    from: F(B.c7[0]),
    duration: F(B.c7[1]) - F(B.c7[0]),
    kicker: "À toi de juger",
    cards: [
      { img: "images/handshake.jpeg", from: F(B.c7[0]), duration: F(B.c7[1]) - F(B.c7[0]), zoom: 1.06, side: -1 },
    ],
  },
];

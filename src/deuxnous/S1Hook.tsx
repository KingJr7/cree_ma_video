import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme } from "./theme";
import { WhatsAppIcon, USBIcon, CashIcon, CalendarIcon, PostitIcon, NotifBadge, CursorIcon, CheckIcon } from "./icons";
import { Logo, Wordmark } from "./Logo";

// S1 — Le Hook (0 à 5s)
// 1) chaos : WhatsApp déborde, USB perdu, billets volants, calendrier, post-it (tremblement)
// 2) curseur balaie l'écran (wipe blanc)
// 3) Logo "Deuxnous" + wordmark + tagline "Tout votre mariage. Au même endroit."

const CHAOS = [
  { kind: "wa", x: 230, y: 230, s: 160, rot: -8, delay: 0, shake: 6 },
  { kind: "usb", x: 1500, y: 180, s: 120, rot: 6, delay: 4, shake: 4 },
  { kind: "cash", x: 1400, y: 820, s: 140, rot: -10, delay: 8, shake: 7 },
  { kind: "cal", x: 260, y: 800, s: 130, rot: 4, delay: 12, shake: 5 },
  { kind: "postit", x: 880, y: 200, s: 120, rot: -3, delay: 6, shake: 4 },
];

const WIPE_FROM = 80;
const WIPE_TO = 110;
const LOGO_FROM = 105;
const TEXT_FROM = 130;

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Wipe : un rectangle blanc qui couvre de gauche à droite
  const wipe = interpolate(frame, [WIPE_FROM, WIPE_TO], [0, 1], {
    easing: Easing.inOut(Easing.bezier(0.65, 0, 0.35, 1)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo pop — high momentum
  const logoP = spring({ frame: frame - LOGO_FROM, fps, config: theme.spring.punch });
  const textP = spring({ frame: frame - TEXT_FROM, fps, config: theme.spring.snap });
  const checkP = spring({ frame: frame - (LOGO_FROM + 8), fps, config: theme.spring.bouncy });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      {/* Pattern très discret de points (flat) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${theme.colors.line} 1.5px, transparent 1.5px)`,
          backgroundSize: "32px 32px",
          opacity: 0.6,
        }}
      />

      {/* Chaos items */}
      {CHAOS.map((it, i) => {
        const enter = spring({ frame: frame - it.delay, fps, config: theme.spring.snap });
        const shakeX = Math.sin((frame + i * 7) / 3) * it.shake * (frame < WIPE_FROM ? 1 : 0);
        const shakeY = Math.cos((frame + i * 5) / 2.7) * it.shake * (frame < WIPE_FROM ? 1 : 0);
        const wipeOut = frame >= WIPE_FROM ? Math.min(1, (frame - WIPE_FROM) / 8) : 0;
        const op = enter * (1 - wipeOut);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: it.x,
              top: it.y,
              transform: `rotate(${it.rot}deg) translate(${shakeX}px, ${shakeY}px)`,
              opacity: op,
              filter: frame >= WIPE_FROM ? `blur(${wipeOut * 8}px)` : "none",
            }}
          >
            <ChaosIcon kind={it.kind} size={it.s} />
          </div>
        );
      })}

      {/* Wipe blanc */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 1920 * wipe,
          background: theme.colors.bg,
        }}
      />

      {/* Curseur qui balaie */}
      {frame >= WIPE_FROM - 6 && frame <= WIPE_TO + 4 ? (
        <div
          style={{
            position: "absolute",
            left: (frame - (WIPE_FROM - 6)) * 60,
            top: 540,
            transform: "translate(-30px, -30px)",
          }}
        >
          <CursorIcon size={70} />
        </div>
      ) : null}

      {/* Logo + Wordmark + Tagline */}
      {frame >= LOGO_FROM ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 48,
              transform: `scale(${interpolate(logoP, [0, 1], [0.4, 1])})`,
              opacity: logoP,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
              <Logo size={180} />
              <Wordmark size={180} />
            </div>
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 56,
                color: theme.colors.onyxSoft,
                opacity: textP,
                transform: `translateY(${interpolate(textP, [0, 1], [16, 0])}px)`,
                maxWidth: 1400,
                textAlign: "center",
                lineHeight: 1.3,
                fontWeight: 500,
              }}
            >
              Tout votre mariage. <span style={{ color: theme.colors.lavender, fontWeight: 800 }}>Au même endroit.</span>
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Petit check qui apparaît sous le logo : "tâches faites" */}
      {frame >= LOGO_FROM + 8 ? (
        <div
          style={{
            position: "absolute",
            right: 280,
            top: 280,
            opacity: checkP,
            transform: `scale(${checkP})`,
          }}
        >
          <CheckIcon size={88} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const ChaosIcon: React.FC<{ kind: string; size: number }> = ({ kind, size }) => {
  if (kind === "wa")
    return (
      <div style={{ position: "relative" }}>
        <WhatsAppIcon size={size} />
        <div style={{ position: "absolute", top: -4, right: -8 }}>
          <NotifBadge n={147} />
        </div>
      </div>
    );
  if (kind === "usb") return <USBIcon size={size} />;
  if (kind === "cash") {
    return (
      <div style={{ position: "relative" }}>
        <CashIcon size={size} />
        <div style={{ position: "absolute", top: -8, right: -12, transform: "rotate(15deg)" }}>
          <NotifBadge n={3} bg={theme.colors.warn} />
        </div>
      </div>
    );
  }
  if (kind === "cal") return <CalendarIcon size={size} />;
  if (kind === "postit") return <PostitIcon size={size} />;
  return null;
};

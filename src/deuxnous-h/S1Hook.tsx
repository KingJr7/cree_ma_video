import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme, D, ST } from "./theme";
import { SpringPop, TextSlideFade } from "./motion";
import { BackgroundParticles } from "./particles";
import { Logo, Wordmark } from "./Logo";
import { WhatsAppIcon, NotifBadge, CheckIcon } from "./icons";

// S1 Hook (0-5s, frames locales 0..150)
// 6 icônes de chaos pop en cascade, léger tremblement,
// puis wipe (rectangle blanc balaie) + logo "Deuxnous" + tagline.
const CHAOS = [
  { kind: "wa", x: 200, y: 200, s: 180, rot: -8, delay: 0 },
  { kind: "usb", x: 1500, y: 180, s: 140, rot: 6, delay: 4 },
  { kind: "cash", x: 1400, y: 820, s: 150, rot: -10, delay: 8 },
  { kind: "cal", x: 240, y: 800, s: 150, rot: 4, delay: 12 },
  { kind: "postit", x: 860, y: 200, s: 140, rot: -3, delay: 6 },
  { kind: "wa", x: 1500, y: 480, s: 130, rot: 8, delay: 16 },
];

const ChaosIcon: React.FC<{ kind: string; size: number }> = ({ kind, size }) => {
  if (kind === "wa")
    return (
      <div style={{ position: "relative" }}>
        <WhatsAppIcon size={size} />
        <div style={{ position: "absolute", top: -6, right: -10 }}>
          <NotifBadge n={147} />
        </div>
      </div>
    );
  if (kind === "usb")
    return (
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <rect x="6" y="20" width="52" height="24" rx="6" fill="#FFFFFF" />
        <rect x="22" y="14" width="6" height="10" rx="2" fill="#9A9AAA" />
        <rect x="36" y="14" width="6" height="10" rx="2" fill="#9A9AAA" />
        <rect x="30" y="12" width="4" height="14" rx="2" fill="#0A0A12" />
      </svg>
    );
  if (kind === "cash")
    return (
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <rect x="6" y="14" width="52" height="36" rx="6" fill={theme.colors.primary} />
        <rect x="10" y="18" width="44" height="28" rx="3" fill="#FFFFFF" opacity=".2" />
        <circle cx="32" cy="32" r="10" fill="#FFFFFF" />
        <text x="32" y="36" textAnchor="middle" fontSize="14" fontWeight="800" fill={theme.colors.primary}>$</text>
      </svg>
    );
  if (kind === "cal")
    return (
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <rect x="6" y="12" width="52" height="48" rx="8" fill={theme.colors.warn} />
        <rect x="6" y="12" width="52" height="14" rx="8" fill="#FFFFFF" opacity=".2" />
        <rect x="14" y="8" width="6" height="14" rx="2" fill="#0A0A12" />
        <rect x="44" y="8" width="6" height="14" rx="2" fill="#0A0A12" />
        <circle cx="22" cy="38" r="3" fill="#FFFFFF" />
        <circle cx="32" cy="38" r="3" fill="#FFFFFF" />
        <circle cx="42" cy="38" r="3" fill="#FFFFFF" />
        <circle cx="22" cy="48" r="3" fill="#FFFFFF" />
        <circle cx="32" cy="48" r="3" fill="#FFFFFF" />
      </svg>
    );
  if (kind === "postit")
    return (
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <rect x="8" y="6" width="48" height="52" rx="4" fill="#FFD76A" />
        <line x1="14" y1="20" x2="50" y2="20" stroke="#0A0A12" strokeWidth="2" opacity=".4" />
        <line x1="14" y1="28" x2="50" y2="28" stroke="#0A0A12" strokeWidth="2" opacity=".4" />
        <line x1="14" y1="36" x2="42" y2="36" stroke="#0A0A12" strokeWidth="2" opacity=".4" />
        <line x1="14" y1="44" x2="46" y2="44" stroke="#0A0A12" strokeWidth="2" opacity=".4" />
      </svg>
    );
  return null;
};

const WIPE_FROM = 80;
const WIPE_TO = 110;
const LOGO_FROM = 100;
const TEXT_FROM = 130;

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Wipe : un rectangle qui balaie de gauche à droite (style Zokaly : cubic-bezier doux)
  const wipe = interpolate(frame, [WIPE_FROM, WIPE_TO], [0, 1], {
    easing: Easing.inOut(Easing.bezier(...theme.easing.camera)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <BackgroundParticles count={18} />

      {/* Chaos items (spring-only) */}
      {CHAOS.map((it, i) => {
        const local = frame - it.delay;
        const enter = spring({ frame: local, fps, config: theme.spring.bouncy });
        const shakeX = Math.sin((frame + i * 7) / 3) * 4 * (frame < WIPE_FROM ? 1 : 0);
        const shakeY = Math.cos((frame + i * 5) / 2.7) * 4 * (frame < WIPE_FROM ? 1 : 0);
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
            <SpringPop from={it.delay} config="bouncy">
              <ChaosIcon kind={it.kind} size={it.s} />
            </SpringPop>
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
          background: "#FFFFFF",
        }}
      />

      {/* Logo + Wordmark + Tagline */}
      {frame >= LOGO_FROM ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 48,
              transform: `scale(${interpolate(spring({ frame: frame - LOGO_FROM, fps, config: theme.spring.uiPop }), [0, 1], [0.4, 1])})`,
              opacity: spring({ frame: frame - LOGO_FROM, fps, config: theme.spring.uiPop }),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
              <Logo size={180} />
              <Wordmark size={180} />
            </div>
            <TextSlideFade from={TEXT_FROM} delay={0} yOffset={24}>
              <div
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: 56,
                  color: theme.colors.text,
                  fontWeight: 500,
                  maxWidth: 1400,
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                Tout votre mariage. <span style={{ color: theme.colors.primary, fontWeight: 800 }}>Au même endroit.</span>
              </div>
            </TextSlideFade>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Check de validation */}
      {frame >= LOGO_FROM + 8 ? (
        <div
          style={{
            position: "absolute",
            right: 280,
            top: 280,
            opacity: spring({ frame: frame - (LOGO_FROM + 8), fps, config: theme.spring.bouncy }),
            transform: `scale(${spring({ frame: frame - (LOGO_FROM + 8), fps, config: theme.spring.bouncy })})`,
          }}
        >
          <CheckIcon size={88} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

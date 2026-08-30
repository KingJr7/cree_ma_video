// Mibeko — une image de fond Pexels plein écran avec overlay, eyebrow + pill (texte_ecran).
import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { theme } from "./theme";
import { SCENES, sceneAt, type Scene } from "./data";

const currentMs = (frame: number, fps: number) => (frame / fps) * 1000;

export const SceneImage: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = currentMs(frame, fps);
  const active = sceneAt(ms) === scene;

  // crossfade d'entrée/sortie sur 12 frames (~400ms)
  const opacity = active
    ? 1
    : 1 - interpolate(ms, [scene.lastMs, scene.lastMs + 400], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  // Ken Burns lent quand la scène est active
  const local = interpolate(ms, [scene.firstMs, Math.max(scene.lastMs, scene.firstMs + 2000)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.83, 0, 0.17, 1),
  });
  const scale = interpolate(local, [0, 1], [1.0, 1.08]);
  const tx = interpolate(local, [0, 1], [0, -28]);
  const ty = interpolate(local, [0, 1], [0, 20]);

  return (
    <AbsoluteFill style={{ opacity, zIndex: 1 }}>
      <Img
        src={staticFile(`imgs/mibeko/${scene.img}`)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
        }}
      />
      {/* voile noir sobre pour la lisibilité */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.25) 34%, rgba(10,10,10,0.3) 55%, rgba(10,10,10,0.94) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Eyebrow: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = currentMs(frame, fps);
  const active = sceneAt(ms) === scene;
  const appear = interpolate(ms, [scene.firstMs - 700, scene.firstMs - 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (!scene.eyebrow) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 5,
        opacity: active ? appear : 0,
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 30,
          letterSpacing: "0.34em",
          color: theme.colors.textDim,
          padding: "14px 30px",
          borderTop: `1px solid ${theme.colors.line}`,
          borderBottom: `1px solid ${theme.colors.line}`,
        }}
      >
        {scene.eyebrow}
      </div>
    </div>
  );
};

export const Pill: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = currentMs(frame, fps);
  const active = sceneAt(ms) === scene;
  const appear = interpolate(ms, [scene.firstMs + 200, scene.firstMs + 700], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (!scene.pill) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 250,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 5,
        opacity: active ? appear : 0,
        transform: `translateY(${interpolate(appear, [0, 1], [16, 0])}px)`,
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontSize: 44,
          fontWeight: 500,
          color: theme.colors.accent,
          background: "rgba(10,10,10,0.6)",
          padding: "18px 34px",
          borderRadius: 999,
        }}
      >
        {scene.pill}
      </div>
    </div>
  );
};

function staticImg(name: string): string {
  return `imgs/mibeko/${name}`;
}

// Boutons de téléchargement (CTA) — actifs sur la scène finale.
export const StoreButtons: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const cta = SCENES[6];
  const active = sceneAt(ms).id === "cta";
  const appear = interpolate(ms, [cta.firstMs + 400, cta.firstMs + 1200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (!active) return null;
  const btn: React.CSSProperties = {
    background: theme.colors.text,
    color: theme.colors.bg,
    fontFamily: theme.fonts.body,
    fontSize: 34,
    fontWeight: 600,
    padding: "22px 40px",
    borderRadius: 999,
    letterSpacing: "-0.01em",
  };
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        zIndex: 6,
        opacity: appear,
        transform: `translateY(${interpolate(appear, [0, 1], [30, 0])}px)`,
      }}
    >
      <div style={{ display: "flex", gap: 20 }}>
        <div style={btn}>▶ Google Play</div>
        <div style={btn}> App Store</div>
      </div>
      <div style={{ fontFamily: theme.fonts.body, fontSize: 26, color: theme.colors.textDim, letterSpacing: "0.1em" }}>
        GRATUIT • MIBEKO
      </div>
    </div>
  );
};

// Export utilitaire pour le logo stable en début/fin.
export const Wordmark: React.FC<{ bottom?: boolean }> = ({ bottom }) => (
  <div
    style={{
      position: "absolute",
      left: 60,
      top: bottom ? undefined : 50,
      bottom: bottom ? 50 : undefined,
      display: "flex",
      alignItems: "center",
      gap: 14,
      zIndex: 6,
      fontFamily: theme.fonts.body,
      letterSpacing: "0.28em",
      fontSize: 26,
      fontWeight: 600,
      color: theme.colors.textDim,
    }}
  >
    <div style={{ width: 26, height: 26, borderRadius: 999, background: theme.colors.accent }} />
    <span style={{ color: theme.colors.text }}>Mibeko</span>
  </div>
);

import React from "react";
import { theme } from "./theme";

export const AppCard: React.FC<{
  children: React.ReactNode;
  width: number;
  bg?: string;
  pad?: number;
  radius?: number;
  shadow?: string;
  style?: React.CSSProperties;
}> = ({ children, width, bg = theme.colors.surface, pad = 20, radius = theme.radius.md, shadow = theme.shadow.card, style }) => (
  <div style={{ width, background: bg, borderRadius: radius, padding: pad, boxShadow: shadow, boxSizing: "border-box", ...style }}>
    {children}
  </div>
);

export const OnyxButton: React.FC<{
  children: React.ReactNode;
  width?: number | string;
  bg?: string;
  fg?: string;
  height?: number;
  style?: React.CSSProperties;
}> = ({ children, width, bg = theme.colors.primary, fg = theme.colors.onyx, height = 64, style }) => (
  <div
    style={{
      width,
      height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: bg,
      color: fg,
      borderRadius: height / 2,
      fontFamily: theme.fonts.body,
      fontWeight: 800,
      fontSize: height * 0.38,
      letterSpacing: "-0.01em",
      boxShadow: `0 8px 0 rgba(0,0,0,0.3), 0 0 30px ${theme.colors.primary}55`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const GhostButton: React.FC<{ children: React.ReactNode; width?: number | string; height?: number }> = ({ children, width, height = 64 }) => (
  <div
    style={{
      width,
      height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(29,211,176,0.15)",
      color: theme.colors.primary,
      borderRadius: height / 2,
      fontFamily: theme.fonts.body,
      fontWeight: 700,
      fontSize: height * 0.36,
    }}
  >
    {children}
  </div>
);

export const Field: React.FC<{
  value: string;
  width: number;
  placeholder?: string;
  fontSize?: number;
  caret?: boolean;
}> = ({ value, width, placeholder, fontSize = 24, caret = false }) => (
  <div
    style={{
      width,
      height: fontSize * 2.2,
      borderRadius: theme.radius.md,
      background: theme.colors.surfaceSoft,
      border: `1.5px solid ${theme.colors.line}`,
      display: "flex",
      alignItems: "center",
      padding: `0 ${fontSize * 0.9}px`,
      fontFamily: theme.fonts.body,
      fontSize,
      color: value ? theme.colors.onyx : theme.colors.onyxSoft,
      boxSizing: "border-box",
    }}
  >
    <span style={{ opacity: value ? 1 : 0.5 }}>{value || placeholder}</span>
    {caret ? (
      <span style={{ display: "inline-block", width: 2, height: fontSize * 1.3, background: theme.colors.primary, marginLeft: 2 }} />
    ) : null}
  </div>
);

export const AppBottomBar: React.FC<{ active?: "home" | "gallery" | "cagnotte" | "profile"; width?: number }> = ({ active = "home", width = 360 }) => {
  const items = [
    { id: "home" as const, label: "Accueil" },
    { id: "gallery" as const, label: "Galerie" },
    { id: "cagnotte" as const, label: "Cagnotte" },
    { id: "profile" as const, label: "Profil" },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: width * 0.16,
        background: "#FFFFFF",
        borderTop: `1px solid ${theme.colors.line}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: `0 ${width * 0.04}px`,
        boxSizing: "border-box",
      }}
    >
      {items.map((it) => {
        const isActive = it.id === active;
        const color = isActive ? theme.colors.primary : theme.colors.onyxSoft;
        return (
          <div key={it.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color }}>
            <div style={{ width: width * 0.06, height: width * 0.06, borderRadius: width * 0.02, background: color }} />
            <span style={{ fontFamily: theme.fonts.body, fontSize: width * 0.024, fontWeight: 700 }}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
};

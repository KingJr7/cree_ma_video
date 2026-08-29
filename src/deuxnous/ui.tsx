import React from "react";
import { theme } from "./theme";
import { CagnotteIcon, GalleryIcon, HomeIcon, ProfileIcon } from "./icons";

// Tab bar bottom : 4 onglets (Accueil, Galerie, Cagnotte, Profil).
// Style "app native" — pas de barre de navigateur, ancrage bas.
export const AppBottomBar: React.FC<{ active?: "home" | "gallery" | "cagnotte" | "profile"; width?: number }> = ({ active = "home", width = 360 }) => {
  const items = [
    { id: "home" as const, icon: HomeIcon, label: "Accueil" },
    { id: "gallery" as const, icon: GalleryIcon, label: "Galerie" },
    { id: "cagnotte" as const, icon: CagnotteIcon, label: "Cagnotte" },
    { id: "profile" as const, icon: ProfileIcon, label: "Profil" },
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
        const color = isActive ? theme.colors.lavender : theme.colors.onyxSoft;
        const Icon = it.icon;
        return (
          <div
            key={it.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color,
            }}
          >
            <Icon size={width * 0.06} color={color} />
            <span style={{ fontFamily: theme.fonts.body, fontSize: width * 0.024, fontWeight: 600 }}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export const AppCard: React.FC<{
  children: React.ReactNode;
  width: number;
  bg?: string;
  pad?: number;
  radius?: number;
  shadow?: string;
  style?: React.CSSProperties;
}> = ({ children, width, bg = "#FFFFFF", pad = 20, radius = theme.radius.md, shadow = theme.shadow.card, style }) => (
  <div
    style={{
      width,
      background: bg,
      borderRadius: radius,
      padding: pad,
      boxShadow: shadow,
      boxSizing: "border-box",
      ...style,
    }}
  >
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
}> = ({ children, width, bg = theme.colors.lavender, fg = "#FFFFFF", height = 64, style }) => (
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
      fontWeight: 700,
      fontSize: height * 0.38,
      letterSpacing: "-0.01em",
      boxShadow: theme.shadow.hard,
      ...style,
    }}
  >
    {children}
  </div>
);

export const GhostButton: React.FC<{ children: React.ReactNode; width?: number | string; height?: number }> = ({
  children,
  width,
  height = 64,
}) => (
  <div
    style={{
      width,
      height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: theme.colors.lavenderWash,
      color: theme.colors.lavender,
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
      background: theme.colors.bgAlt,
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
      <span
        style={{
          display: "inline-block",
          width: 2,
          height: fontSize * 1.3,
          background: theme.colors.lavender,
          marginLeft: 2,
        }}
      />
    ) : null}
  </div>
);

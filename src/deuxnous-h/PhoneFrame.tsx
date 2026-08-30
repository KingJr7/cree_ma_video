import React from "react";
import { theme } from "./theme";

// Mockup téléphone flat : cadre noir mat, écran blanc, encoche + status bar.
export const PhoneFrame: React.FC<{
  width: number;
  height: number;
  children?: React.ReactNode;
  bg?: string;
  showStatusBar?: boolean;
}> = ({ width, height, children, bg = theme.colors.surface, showStatusBar = true }) => (
  <div
    style={{
      width,
      height,
      background: theme.colors.onyx,
      borderRadius: width * 0.12,
      padding: width * 0.018,
      boxShadow: theme.shadow.lift,
      position: "relative",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        background: bg,
        borderRadius: width * 0.105,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: width * 0.022,
          left: "50%",
          transform: "translateX(-50%)",
          width: width * 0.34,
          height: width * 0.05,
          background: theme.colors.onyx,
          borderRadius: width * 0.04,
          zIndex: 5,
        }}
      />
      {showStatusBar ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: width * 0.07,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: `0 ${width * 0.07}px`,
            fontFamily: theme.fonts.body,
            fontSize: width * 0.022,
            fontWeight: 700,
            color: theme.colors.onyx,
            zIndex: 4,
          }}
        >
          <span>9:41</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
              <span style={{ width: 3, height: 4, background: theme.colors.onyx, borderRadius: 1 }} />
              <span style={{ width: 3, height: 6, background: theme.colors.onyx, borderRadius: 1 }} />
              <span style={{ width: 3, height: 8, background: theme.colors.onyx, borderRadius: 1 }} />
              <span style={{ width: 3, height: 10, background: theme.colors.onyx, borderRadius: 1 }} />
            </span>
            <span style={{ width: width * 0.03, height: width * 0.018, border: `1.5px solid ${theme.colors.onyx}`, borderRadius: 3, position: "relative" }}>
              <span style={{ position: "absolute", right: -3, top: 2, width: 2, height: width * 0.008, background: theme.colors.onyx, borderRadius: 1 }} />
            </span>
          </span>
        </div>
      ) : null}
      {children}
    </div>
  </div>
);

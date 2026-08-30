import React from "react";
import { theme } from "./theme";

export const WhatsAppIcon: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <circle cx="32" cy="32" r="30" fill="#25D366" />
    <path
      d="M20 32a12 12 0 0 1 20.5-8.4 12 12 0 0 1 1.6 16.9l1.7 5.7-5.9-1.6A12 12 0 0 1 20 32Zm7.5-3.4c.3.7 1.7 3 1.9 3.3.2.3.3.6 0 1-.3.4-1 1.2-1.3 1.5-.4.3-.7.4-.4 1 .4.7 1.6 2.6 3.4 3.6 2 1 3.5 1.4 4 1.4.5 0 .8-.1 1-.5.3-.4 1-1.2 1.3-1.6.3-.4.6-.3 1-.2.4.1 2.5 1.2 2.9 1.4.4.2.7.3.8.6.1.3.1 1.4-.6 2.4-.7 1-2.1 1.7-2.7 1.7-.7 0-1.2 0-3.2-.8-2.7-1-4.6-3.4-5.8-5-1.2-1.6-2.3-4-2.5-4.6-.2-.6 0-1 .3-1.3.2-.2.5-.4.7-.7.2-.3.3-.4.4-.7.1-.3 0-.6-.1-.8Z"
      fill="#FFFFFF"
    />
  </svg>
);

export const NotifBadge: React.FC<{ n: number; bg?: string }> = ({ n, bg = theme.colors.warn }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 22,
      height: 22,
      padding: "0 6px",
      borderRadius: 11,
      background: bg,
      color: "#FFFFFF",
      fontFamily: theme.fonts.body,
      fontSize: 13,
      fontWeight: 800,
    }}
  >
    {n}
  </span>
);

export const CheckIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <circle cx="12" cy="12" r="11" fill={theme.colors.primary} />
    <path d="M6.5 12.5l3.5 3.5 7.5-7.5" stroke="#0A0A12" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const StarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = "#FFD76A" }) => (
  <svg viewBox="0 0 32 32" width={size} height={size}>
    <path d="M16 3l4.2 9.5 10.4 1-7.8 7 2.2 10.2-9-5.4-9 5.4 2.2-10.2-7.8-7 10.4-1z" fill={color} />
  </svg>
);

export const HeartIcon: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = theme.colors.primary }) => (
  <svg viewBox="0 0 32 32" width={size} height={size}>
    <path
      d="M16 28C8 22 2 17 2 10.5 2 6.5 5 3 9 3c2.5 0 4.5 1.4 5.5 3.4C15.5 4.4 17.5 3 20 3c4 0 7 3.5 7 7.5C27 17 21 22 16 28Z"
      fill={color}
    />
  </svg>
);

export const GiftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 64, color = theme.colors.primary }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="8" y="24" width="48" height="32" rx="6" fill={color} />
    <rect x="28" y="24" width="8" height="32" fill="#0A0A12" opacity=".15" />
    <rect x="6" y="18" width="52" height="10" rx="4" fill={color} />
    <path d="M32 24c-2-8-10-12-14-8s-2 10 6 8c-6 4-6 10 0 12 4-2 8-6 8-12Z" fill="#FF6B6B" />
    <path d="M32 24c2-8 10-12 14-8s2 10-6 8c6 4 6 10 0 12-4-2-8-6-8-12Z" fill="#FF6B6B" />
  </svg>
);

export const CameraIcon: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = theme.colors.onyx }) => (
  <svg viewBox="0 0 32 32" width={size} height={size}>
    <rect x="3" y="8" width="26" height="20" rx="4" fill={color} />
    <rect x="11" y="4" width="10" height="6" rx="1.5" fill={color} />
    <circle cx="16" cy="18" r="6" fill="#FFFFFF" />
    <circle cx="16" cy="18" r="3.5" fill={color} />
  </svg>
);

export const CursorIcon: React.FC<{ size?: number; color?: string }> = ({ size = 80, color = "#FFFFFF" }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M10 6l34 32-14 4 6 14-7 4-6-14-10 8z" fill={color} stroke="#0A0A12" strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

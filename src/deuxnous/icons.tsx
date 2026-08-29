import React from "react";
import { theme } from "./theme";

type P = { size?: number; color?: string; stroke?: number };

export const WhatsAppIcon: React.FC<P> = ({ size = 64, color = "#25D366" }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <circle cx="32" cy="32" r="30" fill={color} />
    <path
      d="M20 32a12 12 0 0 1 20.5-8.4 12 12 0 0 1 1.6 16.9l1.7 5.7-5.9-1.6A12 12 0 0 1 20 32Zm7.5-3.4c.3.7 1.7 3 1.9 3.3.2.3.3.6 0 1-.3.4-1 1.2-1.3 1.5-.4.3-.7.4-.4 1 .4.7 1.6 2.6 3.4 3.6 2 1 3.5 1.4 4 1.4.5 0 .8-.1 1-.5.3-.4 1-1.2 1.3-1.6.3-.4.6-.3 1-.2.4.1 2.5 1.2 2.9 1.4.4.2.7.3.8.6.1.3.1 1.4-.6 2.4-.7 1-2.1 1.7-2.7 1.7-.7 0-1.2 0-3.2-.8-2.7-1-4.6-3.4-5.8-5-1.2-1.6-2.3-4-2.5-4.6-.2-.6 0-1 .3-1.3.2-.2.5-.4.7-.7.2-.3.3-.4.4-.7.1-.3 0-.6-.1-.8Z"
      fill="#FFFFFF"
    />
  </svg>
);

export const USBIcon: React.FC<P> = ({ size = 64, color = theme.colors.onyx }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="6" y="20" width="52" height="24" rx="6" fill={color} />
    <rect x="22" y="14" width="6" height="10" rx="2" fill={theme.colors.onyxSoft} />
    <rect x="36" y="14" width="6" height="10" rx="2" fill={theme.colors.onyxSoft} />
    <rect x="30" y="12" width="4" height="14" rx="2" fill="#FFFFFF" />
    <rect x="14" y="28" width="8" height="4" rx="1" fill="#FFFFFF" opacity=".55" />
    <rect x="42" y="28" width="8" height="4" rx="1" fill="#FFFFFF" opacity=".55" />
  </svg>
);

export const CashIcon: React.FC<P> = ({ size = 64, color = theme.colors.mint }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="6" y="14" width="52" height="36" rx="6" fill={color} />
    <rect x="10" y="18" width="44" height="28" rx="3" fill="#FFFFFF" opacity=".18" />
    <circle cx="32" cy="32" r="10" fill="#FFFFFF" />
    <text x="32" y="36" textAnchor="middle" fontFamily={theme.fonts.display} fontSize="14" fontWeight="700" fill={theme.colors.mint}>
      $
    </text>
  </svg>
);

export const CalendarIcon: React.FC<P> = ({ size = 64, color = theme.colors.warn }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="6" y="12" width="52" height="48" rx="8" fill={color} />
    <rect x="6" y="12" width="52" height="14" rx="8" fill="#FFFFFF" opacity=".2" />
    <rect x="14" y="8" width="6" height="14" rx="2" fill={theme.colors.onyx} />
    <rect x="44" y="8" width="6" height="14" rx="2" fill={theme.colors.onyx} />
    <circle cx="22" cy="38" r="3" fill="#FFFFFF" />
    <circle cx="32" cy="38" r="3" fill="#FFFFFF" />
    <circle cx="42" cy="38" r="3" fill="#FFFFFF" />
    <circle cx="22" cy="48" r="3" fill="#FFFFFF" />
    <circle cx="32" cy="48" r="3" fill="#FFFFFF" />
  </svg>
);

export const PostitIcon: React.FC<P> = ({ size = 64, color = theme.colors.amber }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="8" y="6" width="48" height="52" rx="4" fill={color} />
    <line x1="14" y1="20" x2="50" y2="20" stroke={theme.colors.onyx} strokeWidth="2" opacity=".4" />
    <line x1="14" y1="28" x2="50" y2="28" stroke={theme.colors.onyx} strokeWidth="2" opacity=".4" />
    <line x1="14" y1="36" x2="42" y2="36" stroke={theme.colors.onyx} strokeWidth="2" opacity=".4" />
    <line x1="14" y1="44" x2="46" y2="44" stroke={theme.colors.onyx} strokeWidth="2" opacity=".4" />
  </svg>
);

export const GiftIcon: React.FC<P> = ({ size = 64, color = theme.colors.mint }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="8" y="24" width="48" height="32" rx="6" fill={color} />
    <rect x="28" y="24" width="8" height="32" fill={theme.colors.onyx} opacity=".15" />
    <rect x="6" y="18" width="52" height="10" rx="4" fill={theme.colors.mintSoft || color} />
    <path d="M32 24c-2-8-10-12-14-8s-2 10 6 8c-6 4-6 10 0 12 4-2 8-6 8-12Z" fill="#FF6B6B" />
    <path d="M32 24c2-8 10-12 14-8s2 10-6 8c6 4 6 10 0 12-4-2-8-6-8-12Z" fill="#FF6B6B" />
  </svg>
);

export const ClockIcon: React.FC<P> = ({ size = 64, color = theme.colors.lavender }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <circle cx="32" cy="34" r="22" fill="#FFFFFF" stroke={color} strokeWidth="4" />
    <line x1="32" y1="34" x2="32" y2="20" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <line x1="32" y1="34" x2="44" y2="38" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <rect x="20" y="6" width="24" height="6" rx="2" fill={color} />
    <rect x="40" y="10" width="6" height="6" rx="1" fill={color} />
  </svg>
);

export const HeartIcon: React.FC<P> = ({ size = 32, color = theme.colors.lavender }) => (
  <svg viewBox="0 0 32 32" width={size} height={size}>
    <path
      d="M16 28C8 22 2 17 2 10.5 2 6.5 5 3 9 3c2.5 0 4.5 1.4 5.5 3.4C15.5 4.4 17.5 3 20 3c4 0 7 3.5 7 7.5C27 17 21 22 16 28Z"
      fill={color}
    />
  </svg>
);

export const CameraIcon: React.FC<P> = ({ size = 32, color = theme.colors.onyx }) => (
  <svg viewBox="0 0 32 32" width={size} height={size}>
    <rect x="3" y="8" width="26" height="20" rx="4" fill={color} />
    <rect x="11" y="4" width="10" height="6" rx="1.5" fill={color} />
    <circle cx="16" cy="18" r="6" fill="#FFFFFF" />
    <circle cx="16" cy="18" r="3.5" fill={color} />
  </svg>
);

export const StarIcon: React.FC<P> = ({ size = 32, color = theme.colors.amber }) => (
  <svg viewBox="0 0 32 32" width={size} height={size}>
    <path d="M16 3l4.2 9.5 10.4 1-7.8 7 2.2 10.2-9-5.4-9 5.4 2.2-10.2-7.8-7 10.4-1z" fill={color} />
  </svg>
);

export const HomeIcon: React.FC<P> = ({ size = 28, color = theme.colors.onyxSoft }) => (
  <svg viewBox="0 0 32 32" width={size} height={size}>
    <path d="M6 16L16 6l10 10v12H6z" fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" />
  </svg>
);

export const GalleryIcon: React.FC<P> = ({ size = 28, color = theme.colors.onyxSoft }) => (
  <svg viewBox="0 0 32 32" width={size} height={size}>
    <rect x="4" y="8" width="24" height="18" rx="3" fill="none" stroke={color} strokeWidth="2.4" />
    <circle cx="11" cy="15" r="2" fill={color} />
    <path d="M5 24l7-7 6 6 4-3 5 5" fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" />
  </svg>
);

export const CagnotteIcon: React.FC<P> = ({ size = 28, color = theme.colors.onyxSoft }) => (
  <svg viewBox="0 0 32 32" width={size} height={size}>
    <rect x="4" y="9" width="24" height="18" rx="3" fill="none" stroke={color} strokeWidth="2.4" />
    <path d="M11 9V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2" fill="none" stroke={color} strokeWidth="2.4" />
  </svg>
);

export const ProfileIcon: React.FC<P> = ({ size = 28, color = theme.colors.onyxSoft }) => (
  <svg viewBox="0 0 32 32" width={size} height={size}>
    <circle cx="16" cy="12" r="5" fill="none" stroke={color} strokeWidth="2.4" />
    <path d="M6 28c0-5 5-8 10-8s10 3 10 8" fill="none" stroke={color} strokeWidth="2.4" />
  </svg>
);

export const CheckIcon: React.FC<P> = ({ size = 24, color = theme.colors.mint }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <circle cx="12" cy="12" r="11" fill={color} />
    <path d="M6.5 12.5l3.5 3.5 7.5-7.5" stroke="#FFFFFF" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CursorIcon: React.FC<P> = ({ size = 80, color = theme.colors.onyx }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M10 6l34 32-14 4 6 14-7 4-6-14-10 8z" fill={color} stroke="#FFFFFF" strokeWidth="3" strokeLinejoin="round" />
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
      fontWeight: 700,
    }}
  >
    {n}
  </span>
);

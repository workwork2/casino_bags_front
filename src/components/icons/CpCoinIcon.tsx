"use client";

import { useId } from "react";

type Props = {
  size?: number;
  className?: string;
};

/** Иконка Comp Points (фишка + CP) — iGaming / Riobet-стиль */
export default function CpCoinIcon({ size = 40, className }: Props) {
  const id = useId().replace(/:/g, "");
  const strokeId = `cp-stroke-${id}`;
  const fillId = `cp-fill-${id}`;
  const glowId = `cp-glow-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={strokeId} x1="4" y1="8" x2="44" y2="42">
          <stop stopColor="#f0ebff" />
          <stop offset="0.25" stopColor="#c4b5fd" />
          <stop offset="0.55" stopColor="#8b7cff" />
          <stop offset="1" stopColor="#4c3fd4" />
        </linearGradient>
        <linearGradient id={fillId} x1="24" y1="6" x2="24" y2="44">
          <stop stopColor="#2a3158" />
          <stop offset="0.45" stopColor="#1a1f38" />
          <stop offset="1" stopColor="#0c0e18" />
        </linearGradient>
        <radialGradient id={glowId} cx="30%" cy="25%" r="65%">
          <stop stopColor="rgba(180, 170, 255, 0.22)" />
          <stop offset="0.55" stopColor="rgba(30, 35, 70, 0)" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill={`url(#${fillId})`} />
      <circle cx="24" cy="24" r="21" fill={`url(#${glowId})`} />
      <circle
        cx="24"
        cy="24"
        r="21"
        fill="none"
        stroke={`url(#${strokeId})`}
        strokeWidth="2.4"
      />
      <circle
        cx="24"
        cy="24"
        r="15.5"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
        fill="none"
      />
      <text
        x="24"
        y="29.5"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        fontSize="15"
        fontWeight="800"
        letterSpacing="-0.04em"
        fill={`url(#${strokeId})`}
        style={{ paintOrder: "stroke fill" }}
        stroke="rgba(12, 10, 28, 0.35)"
        strokeWidth="0.6"
      >
        CP
      </text>
    </svg>
  );
}

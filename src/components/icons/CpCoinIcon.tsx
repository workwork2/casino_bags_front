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
        <linearGradient id={strokeId} x1="6" y1="6" x2="42" y2="42">
          <stop stopColor="#b4a9ff" />
          <stop offset="0.4" stopColor="#795dd7" />
          <stop offset="1" stopColor="#3e45be" />
        </linearGradient>
        <linearGradient id={fillId} x1="24" y1="8" x2="24" y2="40">
          <stop stopColor="#252b4a" />
          <stop offset="1" stopColor="#12182a" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="21" stroke={`url(#${strokeId})`} strokeWidth="2.2" fill={`url(#${fillId})`} />
      <circle
        cx="24"
        cy="24"
        r="15.5"
        stroke="rgba(255,255,255,0.1)"
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
      >
        CP
      </text>
    </svg>
  );
}

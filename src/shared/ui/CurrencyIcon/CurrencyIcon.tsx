"use client";

import Image from "next/image";
import type { IconType } from "react-icons";
import { IoWallet, IoWalletOutline } from "react-icons/io5";
import {
  SiBinance,
  SiBitcoin,
  SiBitcoincash,
  SiCardano,
  SiCircle,
  SiDogecoin,
  SiEthereum,
  SiLitecoin,
  SiMonero,
  SiPolygon,
  SiRipple,
  SiSolana,
  SiTether,
  SiTon,
} from "react-icons/si";
import { API_URL } from "@/shared/lib/api/axios";
import { getCryptoBrandColor } from "@/shared/lib/crypto/cryptoBrand";

const SYMBOL_MAP: Record<string, IconType> = {
  BTC: SiBitcoin,
  BCH: SiBitcoincash,
  ETH: SiEthereum,
  USDT: SiTether,
  USDC: SiCircle,
  BUSD: SiBinance,
  DOGE: SiDogecoin,
  LTC: SiLitecoin,
  BNB: SiBinance,
  SOL: SiSolana,
  XRP: SiRipple,
  ADA: SiCardano,
  MATIC: SiPolygon,
  POL: SiPolygon,
  TON: SiTon,
  XMR: SiMonero,
};

export type CurrencyIconProps = {
  symbol: string;
  apiIconPath?: string | null;
  alt?: string;
  size?: number;
  className?: string;
  /**
   * default — цветной бренд; ui — то же для известных тикеров, иначе API / outline-кошелёк.
   */
  variant?: "default" | "ui";
  /** Явный цвет (например #fff на выбранной карточке). Пустая строка = как без пропа. */
  color?: string | null;
};

function resolveTint(
  sym: string,
  Mapped: IconType | undefined,
  color: string | null | undefined,
): string | undefined {
  if (color !== undefined && color !== null && color !== "") {
    return color;
  }
  if (Mapped) {
    return getCryptoBrandColor(sym);
  }
  return undefined;
}

/** Единая иконка валюты: Simple Icons в официальных цветах, иначе растр с API, иначе кошелёк */
export function CurrencyIcon({
  symbol,
  apiIconPath,
  alt,
  size = 22,
  className,
  variant = "default",
  color,
}: CurrencyIconProps) {
  const sym = (symbol || "").trim().toUpperCase();
  const Mapped = sym ? SYMBOL_MAP[sym] : undefined;
  const tint = resolveTint(sym, Mapped, color);

  if (variant === "ui") {
    if (Mapped) {
      return (
        <Mapped
          size={size}
          className={className}
          style={tint ? { color: tint } : undefined}
          aria-hidden
          title={symbol || alt}
        />
      );
    }
    if (apiIconPath) {
      return (
        <Image
          src={`${API_URL}/currenciesIcons${apiIconPath}`}
          alt={alt || symbol || "currency"}
          width={size}
          height={size}
          className={className}
        />
      );
    }
    return (
      <IoWalletOutline
        size={size}
        className={className}
        style={
          tint
            ? { color: tint }
            : { color: "rgba(255, 255, 255, 0.55)" }
        }
        aria-hidden
        title={symbol || alt}
      />
    );
  }

  if (Mapped) {
    return (
      <Mapped
        size={size}
        className={className}
        style={tint ? { color: tint } : undefined}
        aria-hidden
        title={symbol}
      />
    );
  }
  if (apiIconPath) {
    return (
      <Image
        src={`${API_URL}/currenciesIcons${apiIconPath}`}
        alt={alt || symbol || "currency"}
        width={size}
        height={size}
        className={className}
      />
    );
  }
  return (
    <IoWallet
      size={size}
      className={className}
      style={
        tint
          ? { color: tint }
          : { color: "rgba(255, 255, 255, 0.55)" }
      }
      aria-hidden
      title={symbol}
    />
  );
}

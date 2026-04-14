import { slotsData, type SlotGame } from "@/data/slots";
import { liveGamesData, type LiveGame } from "@/data/live-games";
import type { PlayCardItem } from "@/shared/types/playCard";

export type GameInfoForModal = {
  title: string;
  provider: string;
  rtp: string;
  minBet: string;
  maxBet: string;
  volatility: string;
  isLive: boolean;
};

function findCatalogRow(
  slug: string | undefined,
): SlotGame | LiveGame | undefined {
  if (!slug) return undefined;
  return (
    slotsData.find((s) => s.slug === slug) ??
    liveGamesData.find((g) => g.slug === slug)
  );
}

function seededLimits(id: number) {
  const x = Math.abs((id * 7919 + 104729) % 100000) / 100000;
  const rtpSlot = (95.2 + x * 3.2).toFixed(2);
  const maxBets = ["$500", "$750", "$1,000", "$2,500", "$10,000"];
  const mins = ["$0.10", "$0.20", "$0.40", "$1.00"];
  const vols = ["Low", "Medium", "High", "Very high"];
  return {
    rtpSlot,
    maxBet: maxBets[Math.min(maxBets.length - 1, Math.floor(x * maxBets.length))],
    minBet: mins[Math.floor(x * mins.length) % mins.length],
    volatility: vols[Math.floor(x * vols.length) % vols.length],
  };
}

/** Builds Stake-style game info from a card item + optional catalog slug lookup. */
export function resolveGameInfoForModal(item: PlayCardItem): GameInfoForModal {
  const title = item.title?.trim() || "Game";
  const row = findCatalogRow(item.slug);
  const provider =
    item.info?.provider?.trim() ||
    row?.description?.trim() ||
    "—";

  const seeded = seededLimits(item.id);
  const isLive = Boolean(row && "type" in row);

  const rtpPct =
    item.info?.rtpPercent ??
    (isLive ? (96.8 + (item.id % 7) * 0.12).toFixed(2) : seeded.rtpSlot);

  const volatility =
    item.info?.volatility?.trim() ??
    (isLive ? "—" : seeded.volatility);

  return {
    title,
    provider,
    rtp: `${rtpPct}%`,
    minBet: item.info?.minBet ?? seeded.minBet,
    maxBet: item.info?.maxBet ?? seeded.maxBet,
    volatility,
    isLive,
  };
}

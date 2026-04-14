/** Optional overrides for the game info modal (RTP, limits, provider). */
export interface PlayCardInfoOverrides {
  provider?: string;
  rtpPercent?: number;
  maxBet?: string;
  minBet?: string;
  volatility?: string;
}

export interface PlayCardItem {
  id: number;
  imageSrc: string;
  linkHref: string;
  title?: string;
  slug?: string;
  info?: PlayCardInfoOverrides;
}

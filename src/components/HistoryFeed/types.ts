/** Единый размер иконок в блоках истории (типография) */
export const HISTORY_ICON_SIZE = 18;

export type BetFeedStatus = "win" | "loss" | "pending";

export interface BetFeedRow {
  id: string | number;
  gameName: string;
  user: string;
  /** ISO или уже отформатированная строка времени */
  time: string;
  betAmount: number;
  currency: string;
  multiplier: string;
  payout: number;
  status: BetFeedStatus;
}

export type TransactionStatus = "completed" | "pending" | "failed";

export type TransactionTypeKey =
  | "deposit"
  | "withdraw"
  | "swap"
  | "bonus"
  | "other";

export interface TransactionFeedRow {
  id: string | number;
  /** Одна строка «дата • время» или две части */
  dateTime: string;
  typeKey: TransactionTypeKey;
  typeLabel: string;
  currency: string;
  amount: number;
  fee: number;
  status: TransactionStatus;
}

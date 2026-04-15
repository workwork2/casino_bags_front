"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  IoGameControllerOutline,
  IoReceiptOutline,
  IoTimeOutline,
} from "react-icons/io5";

import WalletNavigation from "@/components/WalletNavigation/WalletNavigation";
import { WalletPageLayout } from "@/shared/ui";
import EmptyState from "@/components/EmptyState/EmptyState";
import BetDetailModal from "@/components/BetDetailModal/BetDetailModal";
import {
  BetFeedTable,
  HistorySection,
  TransactionFeedTable,
  type BetFeedRow,
  type BetFeedStatus,
  type TransactionFeedRow,
  type TransactionStatus,
  type TransactionTypeKey,
} from "@/components/HistoryFeed";

import styles from "./page.module.scss";
import { api } from "@/shared/lib/api/axios";

function unwrapHistoryPayload(body: unknown): {
  transactions: unknown[];
  bets: unknown[];
} {
  if (!body || typeof body !== "object") {
    return { transactions: [], bets: [] };
  }
  const b = body as Record<string, unknown>;
  const inner = b.data;
  if (inner && typeof inner === "object") {
    const d = inner as Record<string, unknown>;
    return {
      transactions: Array.isArray(d.transactions) ? d.transactions : [],
      bets: Array.isArray(d.bets) ? d.bets : [],
    };
  }
  return {
    transactions: Array.isArray(b.transactions) ? b.transactions : [],
    bets: Array.isArray(b.bets) ? b.bets : [],
  };
}

function parseBetStatus(raw: unknown): BetFeedStatus {
  const s = String(raw ?? "").toLowerCase();
  if (s === "win" || s === "won" || s === "completed") return "win";
  if (s === "loss" || s === "lost" || s === "lose") return "loss";
  if (s === "pending" || s === "open") return "pending";
  return "loss";
}

function normalizeBetRow(raw: Record<string, unknown>, i: number): BetFeedRow {
  const timeVal = raw.time ?? raw.date ?? raw.createdAt ?? "";
  return {
    id: (raw.id as string | number) ?? i,
    gameName: String(raw.gameName ?? raw.game ?? "—"),
    user: String(raw.user ?? raw.player ?? "Hidden"),
    time: typeof timeVal === "string" ? timeVal : String(timeVal),
    betAmount: Number(raw.betAmount ?? raw.bet ?? raw.stake ?? 0),
    currency: String(raw.currency ?? raw.currencyCode ?? "USDT"),
    multiplier: String(
      raw.coefficient ?? raw.multiplier ?? raw.odds ?? "—",
    ),
    payout: Number(raw.payout ?? raw.win ?? 0),
    status: parseBetStatus(raw.status),
  };
}

function inferTypeKey(raw: Record<string, unknown>): TransactionTypeKey {
  const t = String(raw.type ?? "").toLowerCase();
  if (t.includes("deposit")) return "deposit";
  if (t.includes("withdraw")) return "withdraw";
  if (t.includes("swap") || t.includes("exchange")) return "swap";
  if (t.includes("bonus") || t.includes("reward")) return "bonus";
  return "other";
}

function parseTxStatus(raw: unknown): TransactionStatus {
  const s = String(raw ?? "").toLowerCase();
  if (s === "pending" || s === "processing") return "pending";
  if (s === "failed" || s === "rejected" || s === "cancelled") return "failed";
  return "completed";
}

function normalizeTxRow(raw: Record<string, unknown>, i: number): TransactionFeedRow {
  const typeKey = inferTypeKey(raw);
  const typeLabel = String(raw.type ?? "Transaction");
  const currency = String(raw.currencyCode ?? raw.currency ?? "USDT");
  const rawAmt = Number(raw.amount ?? 0);
  const signed =
    typeKey === "withdraw"
      ? -Math.abs(rawAmt)
      : typeKey === "deposit" || typeKey === "bonus"
        ? Math.abs(rawAmt)
        : rawAmt;

  return {
    id: (raw.id as string | number) ?? i,
    dateTime: String(raw.date ?? raw.dateTime ?? raw.createdAt ?? "—"),
    typeKey,
    typeLabel,
    currency,
    amount: signed,
    fee: Number(raw.fee ?? 0),
    status: parseTxStatus(raw.status),
  };
}

export default function TransactionsHistoryPage() {
  const router = useRouter();
  const [betModalRow, setBetModalRow] = useState<BetFeedRow | null>(null);
  const [transactions, setTransactions] = useState<TransactionFeedRow[]>([]);
  const [bets, setBets] = useState<BetFeedRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    void fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      setIsLoading(true);
      setLoadFailed(false);
      const body = await api.get<unknown>("/profile/history");
      const payload = unwrapHistoryPayload(body);

      const txRows = payload.transactions.map((t, i) =>
        normalizeTxRow(t as Record<string, unknown>, i),
      );
      const betRows = payload.bets.map((b, i) =>
        normalizeBetRow(b as Record<string, unknown>, i),
      );

      setTransactions(txRows);
      setBets(betRows);
    } catch (error) {
      console.error("Failed to load history", error);
      setLoadFailed(true);
      setTransactions([]);
      setBets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const goHome = () => router.push("/");
  const goDeposit = () => router.push("/deposit");
  const goSlots = () => router.push("/slots");

  const hasTransactions = transactions.length > 0;
  const hasBets = bets.length > 0;

  const modalData = useMemo(() => {
    if (!betModalRow) return undefined;
    const dateLabel =
      betModalRow.time.includes("T") ||
      /^\d{4}-\d{2}-\d{2}/.test(betModalRow.time)
        ? new Date(betModalRow.time).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : betModalRow.time;
    return {
      gameName: betModalRow.gameName,
      id: String(betModalRow.id),
      date: dateLabel,
      betAmount: `${Number(betModalRow.betAmount).toLocaleString(undefined, { maximumFractionDigits: 8 })} ${betModalRow.currency}`,
      odds: betModalRow.multiplier,
      payout: `${Number(betModalRow.payout).toLocaleString(undefined, { maximumFractionDigits: 8 })} ${betModalRow.currency}`,
    };
  }, [betModalRow]);

  return (
    <>
      <WalletPageLayout
        title="Transactions history"
        subtitle="Deposits, withdrawals, bonuses, and bets — one ledger."
        titleIcon={<IoReceiptOutline size={32} aria-hidden />}
        navSlot={<WalletNavigation />}
      >
        {isLoading ? (
          <div className={styles.loadingState}>
            <IoTimeOutline size={28} className={styles.loadingIcon} aria-hidden />
            <p>Loading history…</p>
          </div>
        ) : (
          <div className={styles.historyStack}>
            <HistorySection title="Transactions" TitleIcon={IoReceiptOutline}>
              {hasTransactions ? (
                <TransactionFeedTable rows={transactions} />
              ) : (
                <EmptyState
                  imageSrc="/astronaut-safe.svg"
                  title={
                    loadFailed ? "Could not load history" : "No transactions yet"
                  }
                  buttonText={loadFailed ? "Back to home" : "Deposit"}
                  description={
                    loadFailed
                      ? "Try again later or check your connection."
                      : "Deposits, withdrawals, and bonuses will appear here."
                  }
                  onAction={loadFailed ? goHome : goDeposit}
                />
              )}
            </HistorySection>

            <HistorySection
              title="Sports & casino bets"
              TitleIcon={IoGameControllerOutline}
            >
              {hasBets ? (
                <BetFeedTable
                  rows={bets}
                  onRowClick={(r) => setBetModalRow(r)}
                />
              ) : (
                <EmptyState
                  imageSrc="/astronaut-rocket.svg"
                  title={loadFailed ? "Could not load bets" : "No bets yet"}
                  buttonText={loadFailed ? "Back to home" : "Play slots"}
                  description={
                    loadFailed
                      ? "Try again later or check your connection."
                      : "Every wager, multiplier, and payout in one place — like on Stake."
                  }
                  onAction={loadFailed ? goHome : goSlots}
                />
              )}
            </HistorySection>
          </div>
        )}
      </WalletPageLayout>

      <BetDetailModal
        isOpen={Boolean(betModalRow)}
        onClose={() => setBetModalRow(null)}
        data={modalData}
      />
    </>
  );
}

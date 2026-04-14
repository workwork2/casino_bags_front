"use client";

import React, { useMemo, useState } from "react";
import clsx from "clsx";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTimeOutline,
} from "react-icons/io5";
import { CurrencyIcon } from "@/shared/ui/CurrencyIcon/CurrencyIcon";
import type { BetFeedRow, BetFeedStatus } from "./types";
import { HISTORY_ICON_SIZE } from "./types";
import styles from "./historyFeed.module.scss";
import { HistoryPagination } from "./HistoryPagination";

const PAGE_SIZE = 8;

const TABS = ["All bets", "Ongoing", "Completed"] as const;

function formatTimeDisplay(time: string): string {
  if (!time) return "—";
  if (time.includes("T") || /^\d{4}-\d{2}-\d{2}/.test(time)) {
    const d = new Date(time);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  }
  return time;
}

function MobileStatusIcon({ status }: { status: BetFeedStatus }) {
  const sz = HISTORY_ICON_SIZE;
  if (status === "win") {
    return (
      <span className={styles.mobStatWin} aria-label="Won">
        <IoCheckmarkCircle size={sz} />
      </span>
    );
  }
  if (status === "loss") {
    return (
      <span className={styles.mobStatLoss} aria-label="Lost">
        <IoCloseCircle size={sz} />
      </span>
    );
  }
  return (
    <span className={styles.mobStatPending} aria-label="Pending">
      <IoTimeOutline size={sz} />
    </span>
  );
}

function StatusDisplay({ status }: { status: BetFeedStatus }) {
  if (status === "win") {
    return (
      <span className={clsx(styles.statusChip, styles.win)}>
        <span className={styles.statusIcon}>
          <IoCheckmarkCircle size={HISTORY_ICON_SIZE} />
        </span>
        Won
      </span>
    );
  }
  if (status === "loss") {
    return (
      <span className={clsx(styles.statusChip, styles.loss)}>
        <span className={styles.statusIcon}>
          <IoCloseCircle size={HISTORY_ICON_SIZE} />
        </span>
        Lost
      </span>
    );
  }
  return (
    <span className={clsx(styles.statusChip, styles.pending)}>
      <span className={styles.statusIcon}>
        <IoTimeOutline size={HISTORY_ICON_SIZE} />
      </span>
      Pending
    </span>
  );
}

type Props = {
  rows: BetFeedRow[];
  showTabs?: boolean;
  /** Tighter cards/tabs/pagination on tablet & phone (e.g. Recent Winnings widget) */
  compact?: boolean;
  emptyText?: string;
  onRowClick?: (row: BetFeedRow) => void;
  pageSize?: number;
};

export function BetFeedTable({
  rows,
  showTabs = false,
  compact = false,
  emptyText = "No bets found.",
  onRowClick,
  pageSize = PAGE_SIZE,
}: Props) {
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>("All bets");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return rows.filter((bet) => {
      if (!showTabs || activeTab === "All bets") return true;
      if (activeTab === "Ongoing") return bet.status === "pending";
      return bet.status === "win" || bet.status === "loss";
    });
  }, [rows, activeTab, showTabs]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const slice = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  React.useEffect(() => {
    setPage(1);
  }, [activeTab, rows.length, showTabs]);

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const inner = (
    <>
      {showTabs ? (
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={clsx(styles.tabButton, {
                [styles.active]: activeTab === tab,
              })}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      ) : null}

      <div
        className={clsx(styles.table, compact && styles.tableStripMobile)}
      >
        <div className={styles.betHeaderRow}>
          <div className={styles.cell}>Game</div>
          <div className={clsx(styles.cell, styles.colUserBet)}>User</div>
          <div className={clsx(styles.cell, styles.colTimeBet)}>Time</div>
          <div
            className={clsx(styles.cell, styles.colBetAmt, styles.alignRight)}
          >
            Bet
          </div>
          <div
            className={clsx(styles.cell, styles.colMultBet, styles.alignRight)}
          >
            Mult.
          </div>
          <div className={clsx(styles.cell, styles.alignRight)}>Payout</div>
          <div
            className={clsx(styles.cell, styles.colStatusBet, styles.alignRight)}
          >
            Status
          </div>
        </div>

        <div>
          {slice.map((item) => (
            <div
              key={item.id}
              className={clsx(styles.betRow, onRowClick && styles.clickable)}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowClick(item);
                      }
                    }
                  : undefined
              }
              role={onRowClick ? "button" : undefined}
              tabIndex={onRowClick ? 0 : undefined}
            >
              <div
                className={clsx(styles.cell, styles.gameCell)}
                data-label="Game"
              >
                <div className={styles.cellValue}>
                  <span className={styles.gameName}>{item.gameName}</span>
                  <span className={styles.mobileStatus}>
                    <MobileStatusIcon status={item.status} />
                  </span>
                </div>
              </div>
              <div
                className={clsx(styles.cell, styles.colUserBet)}
                data-label="Player"
              >
                <div className={styles.cellValue}>
                  <span className={styles.hiddenUser}>{item.user}</span>
                </div>
              </div>
              <div
                className={clsx(styles.cell, styles.colTimeBet)}
                data-label="Time"
              >
                <div className={styles.cellValue}>
                  <span className={styles.time}>
                    {formatTimeDisplay(item.time)}
                  </span>
                </div>
              </div>
              <div
                className={clsx(styles.cell, styles.colBetAmt, styles.alignRight)}
                data-label="Bet"
              >
                <div className={styles.cellValue}>
                  <div className={styles.amountRow}>
                    <span className={styles.amountSigned}>
                      {Number(item.betAmount).toLocaleString(undefined, {
                        maximumFractionDigits: 8,
                      })}
                    </span>
                    <span className={styles.currencySlot}>
                      <CurrencyIcon
                        symbol={item.currency}
                        size={HISTORY_ICON_SIZE}
                        variant="ui"
                      />
                    </span>
                  </div>
                </div>
              </div>
              <div
                className={clsx(styles.cell, styles.colMultBet, styles.alignRight)}
                data-label="Mult."
              >
                <div className={styles.cellValue}>
                  <span className={styles.multiplier}>{item.multiplier}</span>
                </div>
              </div>
              <div className={clsx(styles.cell, styles.alignRight)} data-label="Payout">
                <div className={styles.cellValue}>
                  <div
                    className={clsx(styles.amountRow, {
                      [styles.win]: item.status === "win",
                      [styles.loss]: item.status === "loss",
                      [styles.pendingPayout]: item.status === "pending",
                    })}
                  >
                    <span className={styles.amountSigned}>
                      {item.status === "win" && item.payout > 0 ? "+" : ""}
                      {Number(item.payout).toLocaleString(undefined, {
                        maximumFractionDigits: 8,
                      })}
                    </span>
                    <span className={styles.currencySlot}>
                      <CurrencyIcon
                        symbol={item.currency}
                        size={HISTORY_ICON_SIZE}
                        variant="ui"
                      />
                    </span>
                  </div>
                </div>
              </div>
              <div
                className={clsx(styles.cell, styles.colStatusBet, styles.alignRight)}
                data-label="Status"
              >
                <div className={styles.cellValue}>
                  <StatusDisplay status={item.status} />
                </div>
              </div>
            </div>
          ))}

          {slice.length === 0 ? (
            <div className={styles.emptyRow}>{emptyText}</div>
          ) : null}
        </div>
      </div>

      <HistoryPagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );

  if (compact) {
    return <div className={styles.feedCompact}>{inner}</div>;
  }
  return inner;
}

"use client";

import React, { useMemo, useState } from "react";
import clsx from "clsx";
import {
  IoArrowDownCircleOutline,
  IoArrowUpCircleOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoDocumentTextOutline,
  IoGiftOutline,
  IoSwapHorizontal,
  IoTimeOutline,
} from "react-icons/io5";
import { CurrencyIcon } from "@/shared/ui/CurrencyIcon/CurrencyIcon";
import type { TransactionFeedRow, TransactionTypeKey } from "./types";
import { HISTORY_ICON_SIZE } from "./types";
import styles from "./historyFeed.module.scss";
import { HistoryPagination } from "./HistoryPagination";

const PAGE_SIZE = 10;

function TypeIcon({ typeKey }: { typeKey: TransactionTypeKey }) {
  const common = { size: HISTORY_ICON_SIZE };
  switch (typeKey) {
    case "deposit":
      return <IoArrowDownCircleOutline {...common} />;
    case "withdraw":
      return <IoArrowUpCircleOutline {...common} />;
    case "swap":
      return <IoSwapHorizontal {...common} />;
    case "bonus":
      return <IoGiftOutline {...common} />;
    default:
      return <IoDocumentTextOutline {...common} />;
  }
}

function TxStatus({ status }: { status: TransactionFeedRow["status"] }) {
  if (status === "completed") {
    return (
      <span className={clsx(styles.statusChip, styles.completed)}>
        <span className={styles.statusIcon}>
          <IoCheckmarkCircle size={HISTORY_ICON_SIZE} />
        </span>
        Completed
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className={clsx(styles.statusChip, styles.failed)}>
        <span className={styles.statusIcon}>
          <IoCloseCircle size={HISTORY_ICON_SIZE} />
        </span>
        Failed
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
  rows: TransactionFeedRow[];
  emptyText?: string;
  pageSize?: number;
};

export function TransactionFeedTable({
  rows,
  emptyText = "No transactions yet.",
  pageSize = PAGE_SIZE,
}: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const slice = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, safePage, pageSize]);

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const signedClass = (n: number) =>
    n >= 0 ? styles.positive : styles.negative;

  return (
    <>
      <div className={styles.table}>
        <div className={styles.txHeaderRow}>
          <div className={styles.cell}>Date</div>
          <div className={clsx(styles.cell, styles.colTxType)}>Type</div>
          <div className={styles.cell}>Asset</div>
          <div className={clsx(styles.cell, styles.alignRight)}>Amount</div>
          <div
            className={clsx(styles.cell, styles.colTxFee, styles.alignRight)}
          >
            Fee
          </div>
          <div className={clsx(styles.cell, styles.alignRight)}>Status</div>
        </div>

        <div>
          {slice.map((item) => (
            <div key={item.id} className={styles.txRow}>
              <div className={styles.cell} data-label="Date">
                <div className={styles.cellValue}>
                  <span className={styles.time}>{item.dateTime}</span>
                </div>
              </div>
              <div className={clsx(styles.cell, styles.colTxType)} data-label="Type">
                <div className={styles.cellValue}>
                  <span className={styles.typeCell}>
                    <span className={styles.typeIcon}>
                      <TypeIcon typeKey={item.typeKey} />
                    </span>
                    <span className={styles.typeLabel}>{item.typeLabel}</span>
                  </span>
                </div>
              </div>
              <div className={styles.cell} data-label="Asset">
                <div className={styles.cellValue}>
                  <span className={styles.typeCell}>
                    <span className={styles.currencySlot}>
                      <CurrencyIcon
                        symbol={item.currency}
                        size={HISTORY_ICON_SIZE}
                        variant="ui"
                      />
                    </span>
                    <span className={styles.typeLabel}>{item.currency}</span>
                  </span>
                </div>
              </div>
              <div
                className={clsx(styles.cell, styles.alignRight)}
                data-label="Amount"
              >
                <div className={styles.cellValue}>
                  <span
                    className={clsx(
                      styles.amountSigned,
                      signedClass(item.amount),
                    )}
                  >
                    {item.amount > 0 ? "+" : ""}
                    {Number(item.amount).toLocaleString(undefined, {
                      maximumFractionDigits: 8,
                    })}
                  </span>
                </div>
              </div>
              <div
                className={clsx(styles.cell, styles.colTxFee, styles.alignRight)}
                data-label="Fee"
              >
                <div className={styles.cellValue}>
                  <span className={styles.feeMuted}>
                    {item.fee
                      ? Number(item.fee).toLocaleString(undefined, {
                          maximumFractionDigits: 8,
                        })
                      : "—"}
                  </span>
                </div>
              </div>
              <div className={clsx(styles.cell, styles.alignRight)} data-label="Status">
                <div className={styles.cellValue}>
                  <TxStatus status={item.status} />
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
}

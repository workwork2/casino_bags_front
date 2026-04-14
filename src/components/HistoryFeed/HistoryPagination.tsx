"use client";

import clsx from "clsx";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { HISTORY_ICON_SIZE } from "./types";
import styles from "./historyFeed.module.scss";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
};

export function HistoryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] =
    totalPages <= 5
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : [1, 2, 3, "...", totalPages];

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={styles.arrowNav}
        aria-label="Previous page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        <IoChevronBack size={HISTORY_ICON_SIZE} />
      </button>

      <div className={styles.pagesWrap}>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`d-${i}`} className={styles.dots}>
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={clsx(
                styles.pageBtn,
                currentPage === p && styles.pageActive,
              )}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className={styles.arrowNav}
        aria-label="Next page"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      >
        <IoChevronForward size={HISTORY_ICON_SIZE} />
      </button>
    </div>
  );
}

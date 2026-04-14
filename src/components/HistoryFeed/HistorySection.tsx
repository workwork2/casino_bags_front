"use client";

import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { HISTORY_ICON_SIZE } from "./types";
import styles from "./historyFeed.module.scss";

type Props = {
  title: string;
  TitleIcon: IconType;
  children: ReactNode;
};

export function HistorySection({ title, TitleIcon, children }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.headerWrap}>
        <span className={styles.titleIcon} aria-hidden>
          <TitleIcon size={HISTORY_ICON_SIZE + 6} />
        </span>
        <h2 className={styles.title}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

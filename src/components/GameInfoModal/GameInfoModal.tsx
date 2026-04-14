"use client";

import React from "react";
import InfoModal from "@/components/InfoModal/InfoModal";
import type { GameInfoForModal } from "@/shared/lib/games/resolveGameInfoForModal";
import styles from "./GameInfoModal.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: GameInfoForModal | null;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

export default function GameInfoModal({ isOpen, onClose, data }: Props) {
  if (!isOpen || !data) return null;

  return (
    <InfoModal isOpen={isOpen} onClose={onClose} title={data.title}>
      <div className={styles.rows}>
        <Row label="Provider" value={data.provider} />
        <Row label="RTP" value={data.rtp} />
        <Row label="Min bet" value={data.minBet} />
        <Row label="Max bet" value={data.maxBet} />
        <Row label="Volatility" value={data.volatility} />
      </div>
      <p className={styles.footnote}>
        RTP and bet limits are indicative; actual values may depend on currency,
        jurisdiction, and game version.
      </p>
    </InfoModal>
  );
}

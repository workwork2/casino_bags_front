"use client";

import React from "react";
import { IoTrophyOutline } from "react-icons/io5";

import { BetFeedTable, type BetFeedRow } from "@/components/HistoryFeed";
import styles from "./RecentWinnings.module.scss";

interface RecentWinningsProps {
  title?: string;
}

const MOCK_BETS: BetFeedRow[] = [
  {
    id: "1",
    gameName: "Sweet Bonanza",
    user: "JohnD",
    time: new Date().toISOString(),
    betAmount: 0.005,
    currency: "BTC",
    multiplier: "x2.5",
    payout: 0.0125,
    status: "win",
  },
  {
    id: "2",
    gameName: "Gates of Olympus",
    user: "Alex99",
    time: new Date(Date.now() - 60000).toISOString(),
    betAmount: 0.15,
    currency: "ETH",
    multiplier: "x0.0",
    payout: 0,
    status: "loss",
  },
  {
    id: "3",
    gameName: "Aviator",
    user: "ProGamer",
    time: new Date(Date.now() - 150000).toISOString(),
    betAmount: 50,
    currency: "USDT",
    multiplier: "x1.5",
    payout: 75,
    status: "win",
  },
  {
    id: "4",
    gameName: "Crazy Time",
    user: "Lucky",
    time: new Date(Date.now() - 300000).toISOString(),
    betAmount: 1.5,
    currency: "LTC",
    multiplier: "—",
    payout: 0,
    status: "pending",
  },
  {
    id: "5",
    gameName: "The Dog House",
    user: "MaxBet",
    time: new Date(Date.now() - 450000).toISOString(),
    betAmount: 100,
    currency: "USDT",
    multiplier: "x10",
    payout: 1000,
    status: "win",
  },
  {
    id: "6",
    gameName: "Sugar Rush",
    user: "CryptoKing",
    time: new Date(Date.now() - 600000).toISOString(),
    betAmount: 0.02,
    currency: "BTC",
    multiplier: "x100",
    payout: 2.0,
    status: "win",
  },
];

const RecentWinnings: React.FC<RecentWinningsProps> = ({
  title = "Recent Winnings",
}) => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.headerWrap}>
        <IoTrophyOutline className={styles.titleIcon} />
        <h2 className={styles.title}>{title}</h2>
      </div>
      <BetFeedTable
        rows={MOCK_BETS}
        showTabs
        compact
        emptyText="No bets found."
      />
    </section>
  );
};

export default RecentWinnings;

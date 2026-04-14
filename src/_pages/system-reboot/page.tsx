"use client";

import React, { useState, useEffect } from "react";
import { IoConstructOutline, IoTimeOutline } from "react-icons/io5";
import styles from "./SystemReboot.module.scss";

export default function SystemRebootPage() {
  const [timeLeft, setTimeLeft] = useState(571);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.iconWrap} aria-hidden>
            <IoConstructOutline className={styles.heroIcon} />
          </div>

          <h1 className={styles.title}>We&apos;re upgrading the site</h1>

          <p className={styles.description}>
            Maintenance is in progress. We&apos;ll be back shortly — thanks for
            your patience.
          </p>

          <div className={styles.timerBlock}>
            <IoTimeOutline size={22} className={styles.timerIcon} aria-hidden />
            <span>Estimated time left: {formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

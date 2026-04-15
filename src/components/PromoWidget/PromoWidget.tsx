"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./PromoWidget.module.scss";

import { BsClockHistory } from "react-icons/bs";

interface PromoWidgetProps {
  timer: string;
  amount?: string;
  rewardImageSrc: string | StaticImageData;
  onSecondaryAction?: () => void;
  onPrimaryAction?: () => void;
}

const PromoWidget: React.FC<PromoWidgetProps> = ({
  timer,
  amount = "$ 0.00",
  rewardImageSrc,
  onSecondaryAction,
  onPrimaryAction,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <div className={styles.iconWrapper}>
            <BsClockHistory size={20} color="#a78bfa" />
          </div>
          <h2 className={styles.title}>Кэшбэк</h2>
        </div>
        <div className={styles.timerBlock}>
          <span className={styles.timerValue}>{timer}</span>
        </div>
      </div>

      <div className={styles.contentArea}>
        <div className={styles.imageArea}>
          <Image
            src={rewardImageSrc}
            alt="Cashback"
            fill
            sizes="(max-width: 900px) 72px, 96px"
            quality={100}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <div className={styles.amountBlock}>
          <span className={styles.amountValue}>{amount}</span>
        </div>

        <p className={styles.subtitle}>
          Возвращаем часть проигранных средств. Играй уверенно!
        </p>

        <div className={styles.actionArea}>
          <button className={styles.secondaryBtn} onClick={onSecondaryAction}>
            Условия
          </button>
          <button className={styles.primaryBtn} onClick={onPrimaryAction}>
            Забрать бонус
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoWidget;
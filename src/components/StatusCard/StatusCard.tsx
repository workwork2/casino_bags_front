import React from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./StatusCard.module.scss";

export interface BenefitItemProps {
  label: string;
  value?: string | number;
  isAvailable: boolean;
}

interface StatusCardProps {
  title: string;
  iconSrc: string | StaticImageData;
  bgSrc: string | StaticImageData;
  currentMoney: number;
  targetMoney: number;
  maxProgress: number;
  isCurrentLevel?: boolean; // Добавили флаг для активного статуса
  benefits: BenefitItemProps[];
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  iconSrc,
  bgSrc,
  currentMoney,
  targetMoney,
  maxProgress,
  isCurrentLevel,
  benefits,
}) => {
  const progressPercent = Math.min((currentMoney / maxProgress) * 100, 100);

  return (
    <div
      className={`${styles.card} ${isCurrentLevel ? styles.activeCard : ""}`}
    >
      {/* 1. Слой фона (с затемнением) */}
      <div className={styles.bgLayer}>
        <Image
          src={bgSrc}
          alt="Card background"
          fill
          style={{ objectFit: "cover" }}
          quality={80}
        />
        <div className={styles.overlay} />
      </div>

      {/* 2. Контент */}
      <div className={styles.contentRelative}>
        <div className={styles.iconWrapper}>
          <Image
            src={iconSrc}
            alt="Status Icon"
            width={72}
            height={72}
            priority
          />
        </div>

        <h2 className={styles.title}>{title}</h2>

        {/* Секция прогресса */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span>Ваш прогресс</span>
            <div className={styles.currentValues}>
              <span className={styles.accentText}>CP{currentMoney}</span> / CP
              {targetMoney}
            </div>
          </div>

          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className={styles.scaleLabels}>
            <span>$0</span>
            <span>${maxProgress}</span>
          </div>
        </div>

        {/* Список преимуществ */}
        <ul className={styles.benefitsList}>
          {benefits.map((item, index) => (
            <li
              key={index}
              className={`${styles.benefitItem} ${item.isAvailable ? styles.available : ""}`}
            >
              <span className={styles.benefitLabel}>{item.label}</span>

              {item.isAvailable ? (
                <span className={`${styles.benefitValue} ${styles.active}`}>
                  {item.value}
                </span>
              ) : (
                <span className={`${styles.benefitValue} ${styles.inactive}`}>
                  ✕
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StatusCard;

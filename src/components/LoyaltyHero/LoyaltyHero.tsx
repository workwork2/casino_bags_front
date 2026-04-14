"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import { IoDiamondOutline } from "react-icons/io5"; // Как пункт Loyalty в SlideBar (navigation)
import styles from "./LoyaltyHero.module.scss";

interface LoyaltyHeroProps {
  currentPoints: number;
  maxPoints: number;
  userName: string;
  nextLevelName: string;
  imageSrc: string | StaticImageData;
}

const LoyaltyHero: React.FC<LoyaltyHeroProps> = ({
  currentPoints,
  maxPoints,
  userName,
  nextLevelName,
  imageSrc,
}) => {
  const progressPercent = Math.min((currentPoints / maxPoints) * 100, 100);

  return (
    <div className={styles.heroWrapper}>
      <div className={styles.contentLeft}>
        <div className={styles.titleWrap}>
          <IoDiamondOutline className={styles.titleIcon} aria-hidden />
          <h1 className={styles.title}>Программа лояльности</h1>
        </div>

        <p className={styles.subtitle}>
          Играйте, повышайте свой статус, получайте больше привилегий и бонусов!
        </p>

        {/* Блок с прогрессом */}
        <div className={styles.progressBlock}>
          <div className={styles.statsRow}>
            <span className={styles.userText}>
              {userName}, до статуса{" "}
              <strong style={{ color: "#fff" }}>{nextLevelName}</strong>:
            </span>
            <span className={styles.points}>
              CP {currentPoints}{" "}
              <span className={styles.maxPoints}> / {maxPoints}</span>
            </span>
          </div>

          <div className={styles.progressBarBg}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <button className={styles.actionButton}>Продолжить игру</button>
        </div>
      </div>

      <div className={styles.imageRight}>
        {/* Картинка статуса. Убедитесь, что файлы лежат в папке /public */}
        <Image
          src={imageSrc}
          alt="Loyalty Crown"
          width={220}
          height={220}
          priority
          className={styles.crownImage}
        />
      </div>
    </div>
  );
};

export default LoyaltyHero;

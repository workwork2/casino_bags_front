"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import { IoDiamondOutline } from "react-icons/io5"; // Как пункт Loyalty в SlideBar (navigation)
import CpCoinIcon from "@/components/icons/CpCoinIcon";
import styles from "./LoyaltyHero.module.scss";

function formatCp(n: number) {
  return new Intl.NumberFormat("ru-RU").format(Math.max(0, Math.floor(n)));
}

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
  const progressPercent =
    maxPoints > 0 ? Math.min((currentPoints / maxPoints) * 100, 100) : 0;

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
              <CpCoinIcon className={styles.cpIcon} size={24} />
              <span className={styles.pointsInner} aria-label="Comp Points">
                <span className={styles.cpNumbers}>
                  {formatCp(currentPoints)}
                  <span className={styles.maxPoints}> / {formatCp(maxPoints)}</span>
                </span>
              </span>
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

"use client";

import React from "react";
import styles from "./SocialPromoCard.module.scss";
import { FaTelegram, FaXTwitter, FaInstagram, FaDiscord } from "react-icons/fa6";

export const SocialPromoCard = () => {
  return (
    <div className={styles.card}>
      {/* ВЕРХНЯЯ ЧАСТЬ (Прижата к верху, идентична PromoCard) */}
      <div className={styles.topContent}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <div className={styles.iconWrapper}>
              <span className={styles.emoji}>🎉</span>
            </div>
            <h2 className={styles.title}>
              Больше бонусов в соцсетях!
            </h2>
          </div>
        </div>

        <p className={styles.subtitle}>
          Подпишись на наши социальные сети, чтобы участвовать в розыгрышах и получать секретные бонусы первым.
        </p>
      </div>

      {/* НИЖНЯЯ ЧАСТЬ (Кнопки, прижаты к низу) */}
      <div className={styles.body}>
        <div className={styles.socialGrid}>
          <a href="#" className={`${styles.socialBtn} ${styles.tg}`} aria-label="Telegram">
            <FaTelegram size={20} />
          </a>
          <a href="#" className={`${styles.socialBtn} ${styles.tw}`} aria-label="Twitter">
            <FaXTwitter size={20} />
          </a>
          <a href="#" className={`${styles.socialBtn} ${styles.ig}`} aria-label="Instagram">
            <FaInstagram size={20} />
          </a>
          <a href="#" className={`${styles.socialBtn} ${styles.ds}`} aria-label="Discord">
            <FaDiscord size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};
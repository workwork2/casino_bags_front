"use client";

import React from "react";
import styles from "./page.module.scss";
import { PromoCard } from "@/components/PromoCard/PromoCard";
import PromoWidget from "@/components/PromoWidget/PromoWidget";
import BonusCard, { BonusDetail } from "@/components/BonusCard/BonusCard";
import { SocialPromoCard } from "@/components/SocialPromoCard/SocialPromoCard";

import { BsLightningCharge, BsTrophy, BsShieldCheck } from "react-icons/bs";
import { FaGift, FaBoxOpen, FaDice, FaCoins } from "react-icons/fa6";

const commonBonusDetails: BonusDetail[] = [
  {
    id: 1,
    icon: <BsLightningCharge size={20} color="#8b5cf6" />,
    text: "Get this bonus if you have",
    highlightedText: "between $100 and $10,000",
  },
  {
    id: 2,
    icon: <BsTrophy size={20} color="#8b5cf6" />,
    text: "Double the amount on",
    highlightedText: "your account!",
  },
  {
    id: 3,
    icon: <BsShieldCheck size={20} color="#8b5cf6" />,
    text: "Play the bonus with a",
    highlightedText: "wager of 35x.",
  },
];

const bonuses = [
  {
    id: 1,
    mainIcon: <FaDice size={75} color="#c4b5fd" />, 
    bonusValue: "70 FS",
    description: "За регистрацию",
    glowColor: "rgba(62, 48, 233, 0.5)",
    actionType: "button" as const,
    actionText: "Получить",
    details: commonBonusDetails,
  },
  {
    id: 2,
    mainIcon: <FaGift size={75} color="#fbbf24" />, 
    bonusValue: "+100%",
    description: "мгновенно на счёт",
    glowColor: "rgba(139, 92, 246, 0.4)",
    actionType: "text" as const,
    actionText: "ЗА ПЕРВЫЙ ДЕПОЗИТ",
    details: commonBonusDetails,
  },
  {
    id: 3,
    mainIcon: <FaBoxOpen size={75} color="#f472b6" />, 
    bonusValue: "+75%",
    description: "мгновенно на счёт",
    glowColor: "rgba(236, 72, 153, 0.4)",
    actionType: "text" as const,
    actionText: "ЗА ВТОРОЙ ДЕПОЗИТ",
    details: commonBonusDetails,
  },
  {
    id: 4,
    mainIcon: <FaCoins size={75} color="#38bdf8" />, 
    bonusValue: "+50%",
    description: "мгновенно на счёт",
    glowColor: "rgba(56, 189, 248, 0.4)",
    actionType: "text" as const,
    actionText: "ЗА ТРЕТИЙ ДЕПОЗИТ",
    details: commonBonusDetails,
  },
];

export default function BonusesPage() {
  return (
    <div className={`container ${styles.bonusesPage}`}>
      
      <div className={styles.topSection}>
        <div className={styles.widgetWrapper}>
          <PromoCard onSubmit={(code) => console.log("Промокод:", code)} />
        </div>
        
        <div className={styles.widgetWrapper}>
          <SocialPromoCard />
        </div>

        <div className={styles.widgetWrapper}>
          <PromoWidget
            timer="05:06:35"
            amount="$ 1,450.50"
            rewardImageSrc="/money-bag.svg"
            onSecondaryAction={() => console.log("Условия кэшбэка")}
            onPrimaryAction={() => console.log("Забрать кэшбэк")}
          />
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.headerWrapper}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.emoji}>🎁</span> Мои бонусы
          </h2>
        </div>

        <div className={styles.bonusesGrid}>
          {bonuses.map((bonus) => (
            <BonusCard
              key={bonus.id}
              mainIcon={bonus.mainIcon} 
              bonusValue={bonus.bonusValue}
              description={bonus.description}
              actionType={bonus.actionType}
              actionText={bonus.actionText}
              glowColor={bonus.glowColor}
              details={bonus.details}
              backTitle="Условия бонуса"
              onButtonClick={() => console.log("Получить бонус", bonus.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
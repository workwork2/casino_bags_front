"use client";

import React, { CSSProperties, useState } from "react";
import styles from "./BonusCard.module.scss";
import { FaInfo, FaRegTrashCan } from "react-icons/fa6";

export interface BonusDetail {
  id: string | number;
  icon: React.ReactNode;
  text: string;
  highlightedText?: string;
}

interface BonusCardProps {
  mainIcon: React.ReactNode;
  bonusValue: string;
  description: string;
  actionType: "button" | "text";
  actionText: string;
  glowColor?: string;
  backTitle?: string;
  details?: BonusDetail[];
  onButtonClick?: () => void;
  onDeleteClick?: () => void; // Добавили пропс для удаления
}

export default function BonusCard({
  mainIcon,
  bonusValue,
  description,
  actionType,
  actionText,
  glowColor = "rgba(62, 48, 233, 0.4)",
  backTitle = "Условия бонуса",
  details = [],
  onButtonClick,
  onDeleteClick,
}: BonusCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsFlipped((prev) => !prev);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteClick) onDeleteClick();
    else console.log("Удалить бонус");
  };

  const sceneStyle = { "--glow-color": glowColor } as CSSProperties;

  return (
    <div className={styles.cardScene} style={sceneStyle}>
      <div className={`${styles.cardInner} ${isFlipped ? styles.flipped : ""}`}>
        
        {/* ЛИЦЕВАЯ СТОРОНА */}
        <div className={styles.cardFront}>
          
          {/* Симметричные кнопки сверху */}
          <button
            className={styles.deleteBtn}
            onClick={handleDelete}
            aria-label="Delete"
          >
            <FaRegTrashCan size={12} color="#f87171" />
          </button>

          <button className={styles.infoBtn} onClick={handleFlip} aria-label="Info">
            <FaInfo size={12} color="#94a3b8" />
          </button>

          {/* Центрирование главной иконки */}
          <div className={styles.iconSpacer}>
            <div className={styles.imageWrapper}>
              <div className={styles.glowEffect} aria-hidden />
              <div className={styles.iconContainer}>
                {mainIcon}
              </div>
            </div>
          </div>

          <div className={styles.textWrapper}>
            <h3 className={styles.bonusValue}>{bonusValue}</h3>
            <p className={styles.description}>{description}</p>
          </div>

          <div className={styles.footerAction}>
            {actionType === "button" ? (
              <button
                className={styles.actionBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onButtonClick?.();
                }}
              >
                {actionText}
              </button>
            ) : (
              <span className={styles.actionText}>{actionText}</span>
            )}
          </div>
        </div>

        {/* ЗАДНЯЯ СТОРОНА */}
        <div className={styles.cardBack}>
          <div className={styles.backContentWrap}>
            <h3 className={styles.backTitle}>{backTitle}</h3>
            
            <div className={styles.detailsList}>
              {details.length > 0 ? (
                details.map((item) => (
                  <div key={item.id} className={styles.detailItem}>
                    <div className={styles.detailIcon}>{item.icon}</div>
                    <p className={styles.detailText}>
                      {item.text}{" "}
                      {item.highlightedText && (
                        <span className={styles.highlight}>{item.highlightedText}</span>
                      )}
                    </p>
                  </div>
                ))
              ) : (
                <p className={styles.noData}>Нет информации</p>
              )}
            </div>
          </div>
          
          <button
            className={styles.backCloseBtn}
            onClick={handleFlip}
            aria-label="Back to bonus card"
          >
            Назад
          </button>
        </div>

      </div>
    </div>
  );
}
"use client";

import React, { useState, useCallback } from "react";
import clsx from "clsx";
import Image from "next/image";
import PlayCard from "../PlayCard/PlayCard";
import GameInfoModal from "@/components/GameInfoModal/GameInfoModal";
import { resolveGameInfoForModal } from "@/shared/lib/games/resolveGameInfoForModal";
import type { PlayCardItem } from "@/shared/types/playCard";
import styles from "./CategoryGrid.module.scss";
import { BsArrowDownCircle } from "react-icons/bs";

interface GameItem {
  id: number;
  title: string;
  imageSrc: string;
  slug: string;
}

interface CategoryGridProps {
  title: string;
  games: GameItem[];
  initialCount?: number;
  /** Нижний отступ как у последнего блока на главной (RecentWinnings) */
  isLastSection?: boolean;
}

const getIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("popular")) return "🔥";
  if (t.includes("new")) return "✨";
  if (t.includes("slots")) return "🎰";
  if (t.includes("bonus") || t.includes("buy")) return "💰";
  if (t.includes("megaways")) return "⚡";
  if (t.includes("live") || t.includes("show")) return "🎥";
  if (t.includes("roulette")) return "🎡";
  if (t.includes("blackjack")) return "🃏";
  return "🎮";
};

export default function CategoryGrid({
  title,
  games,
  initialCount = 12,
  isLastSection = false,
}: CategoryGridProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [infoItem, setInfoItem] = useState<PlayCardItem | null>(null);

  const handleInfoClick = useCallback((item: PlayCardItem) => {
    setInfoItem(item);
  }, []);

  const closeInfo = useCallback(() => setInfoItem(null), []);

  const totalGames = games.length;
  // Проверяем, показали ли мы все доступные игры
  const isAllShown = visibleCount >= totalGames;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 12, totalGames));
  };

  if (totalGames === 0) return null;

  // Если показаны не все, резервируем последнюю ячейку (visibleCount - 1) под карточку "Показать еще"
  const displayedGamesCount = isAllShown ? visibleCount : visibleCount - 1;
  const displayedGames = games.slice(0, displayedGamesCount);
  
  // Берем картинку следующей игры для фона карточки "Показать еще"
  const nextGameForBg = !isAllShown ? games[displayedGamesCount] : null;

  return (
    <section
      className={clsx(styles.section, isLastSection && styles.sectionLast)}
    >
      <div className={styles.headerWrapper}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.emoji}>{getIcon(title)}</span> {title}
        </h2>
        <div className={styles.countBadge}>{totalGames} Games</div>
      </div>

      <div className={styles.grid}>
        {/* Рендерим обычные карточки */}
        {displayedGames.map((game) => (
          <div key={game.id} className={styles.cardHover}>
            <PlayCard
              item={{
                id: game.id,
                title: game.title,
                imageSrc: game.imageSrc,
                linkHref: `/game/${game.slug}`,
                slug: game.slug,
              }}
              onInfoClick={handleInfoClick}
            />
          </div>
        ))}

        {/* Рендерим карточку "Показать еще" последней в сетке */}
        {!isAllShown && nextGameForBg && (
          <div className={styles.showMoreCard} onClick={handleShowMore}>
            <Image
              src={nextGameForBg.imageSrc}
              alt="Показать еще"
              fill
              className={styles.showMoreBgImage}
            />
            <div className={styles.showMoreOverlay}>
              <span className={styles.showMoreText}>Показать еще</span>
              <div className={styles.showMoreIcon}>
                <BsArrowDownCircle color="#ffffff" />
              </div>
            </div>
          </div>
        )}
      </div>

      <GameInfoModal
        isOpen={Boolean(infoItem)}
        onClose={closeInfo}
        data={infoItem ? resolveGameInfoForModal(infoItem) : null}
      />
    </section>
  );
}
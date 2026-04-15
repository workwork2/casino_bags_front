"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import PlayCard from "../PlayCard/PlayCard";
import GameInfoModal from "@/components/GameInfoModal/GameInfoModal";
import { resolveGameInfoForModal } from "@/shared/lib/games/resolveGameInfoForModal";
import type { PlayCardItem } from "@/shared/types/playCard";
import styles from "./SlotsCarousel.module.scss";
import { BsArrowDownCircle } from "react-icons/bs";

/** Демо-список на ~4 блока по 11 карточек + запас под «Показать ещё» */
const FALLBACK_GAMES = Array.from({ length: 48 }).map((_, i) => ({
  id: i + 1,
  title: `Слот ${i + 1}`,
  img: `https://picsum.photos/seed/${i + 30}/400/300`,
}));

export type SlotsCarouselProps = {
  games?: any[];
  /** Заголовок секции (по умолчанию как раньше) */
  title?: string;
  /** Эмодзи слева от заголовка */
  emoji?: string;
  /** Смещение в общем списке игр (для второго/третьего блока на главной) */
  sliceStart?: number;
};

export default function SlotsCarousel(props: SlotsCarouselProps) {
  const {
    games: gamesProp,
    title = "Игры месяца",
    emoji = "👩‍💼",
    sliceStart = 0,
  } = props;

  const baseGames = useMemo(() => {
    if (gamesProp?.length) return gamesProp;
    return FALLBACK_GAMES;
  }, [gamesProp]);

  const [infoItem, setInfoItem] = useState<PlayCardItem | null>(null);
  const handleInfoClick = useCallback((item: PlayCardItem) => {
    setInfoItem(item);
  }, []);
  const closeInfo = useCallback(() => setInfoItem(null), []);

  const visibleGames = baseGames.slice(sliceStart, sliceStart + 11);
  const lastGame = visibleGames[visibleGames.length - 1];

  return (
    <section className={styles.section}>
      <div className={styles.headerWrapper}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.emoji} aria-hidden>
            {emoji}
          </span>
          {title}
        </h2>
        <button type="button" className={styles.allButton}>
          все
        </button>
      </div>

      <div className={styles.grid}>
        {visibleGames.map((slot) => (
          <PlayCard
            key={`${sliceStart}-${slot.id}`}
            item={{
              id: slot.id,
              title: slot.title,
              imageSrc: slot.img,
              linkHref: `/game/${slot.id}`,
              info: { provider: "Demo provider" },
            }}
            onInfoClick={handleInfoClick}
          />
        ))}

        <div className={styles.showMoreCard}>
          {lastGame?.img ? (
            <Image
              src={lastGame.img}
              alt="Показать еще"
              fill
              className={styles.showMoreBgImage}
            />
          ) : null}
          <div className={styles.showMoreOverlay}>
            <span className={styles.showMoreText}>Показать еще</span>
            <div className={styles.showMoreIcon}>
              <BsArrowDownCircle color="#ffffff" />
            </div>
          </div>
        </div>
      </div>

      <GameInfoModal
        isOpen={Boolean(infoItem)}
        onClose={closeInfo}
        data={infoItem ? resolveGameInfoForModal(infoItem) : null}
      />
    </section>
  );
}

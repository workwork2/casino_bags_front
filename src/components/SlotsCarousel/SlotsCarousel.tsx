"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import PlayCard from "../PlayCard/PlayCard";
import GameInfoModal from "@/components/GameInfoModal/GameInfoModal";
import { resolveGameInfoForModal } from "@/shared/lib/games/resolveGameInfoForModal";
import type { PlayCardItem } from "@/shared/types/playCard";
import styles from "./SlotsCarousel.module.scss";
import { BsArrowDownCircle } from "react-icons/bs";

// 11 слотов + «Показать еще» = 12 ячеек — полные ряды при сетке 6·4·3·2 (кратно 12).
const MOCK_GAMES = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `Слот ${i + 1}`,
  img: `https://picsum.photos/seed/${i + 30}/400/300`,
}));

interface SlotsCarouselProps {
  games?: any[];
}

export default function SlotsCarousel(props: SlotsCarouselProps) {
  const games = props?.games;
  const [infoItem, setInfoItem] = useState<PlayCardItem | null>(null);
  const handleInfoClick = useCallback((item: PlayCardItem) => {
    setInfoItem(item);
  }, []);
  const closeInfo = useCallback(() => setInfoItem(null), []);

  const visibleGames = games?.slice(0, 11);
  const lastGame = games?.[games?.length - 1];

  return (
    <section className={styles.section}>
      <div className={styles.headerWrapper}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.emoji}>👩‍💼</span> Игры месяца
        </h2>
        <button className={styles.allButton}>все</button>
      </div>

      <div className={styles.grid}>
        {visibleGames?.map((slot) => (
          <PlayCard
            key={slot.id}
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

        {/* Карточка "Показать еще" */}
        <div className={styles.showMoreCard}>
          <Image
            src={lastGame?.img}
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
      </div>

      <GameInfoModal
        isOpen={Boolean(infoItem)}
        onClose={closeInfo}
        data={infoItem ? resolveGameInfoForModal(infoItem) : null}
      />
    </section>
  );
}

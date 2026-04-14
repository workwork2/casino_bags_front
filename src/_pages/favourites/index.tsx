"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Favorites.module.scss";
import { slotsData } from "@/data/slots";
import PlayCard from "@/components/PlayCard/PlayCard";
import GameInfoModal from "@/components/GameInfoModal/GameInfoModal";
import { resolveGameInfoForModal } from "@/shared/lib/games/resolveGameInfoForModal";
import type { PlayCardItem } from "@/shared/types/playCard";
import clsx from "clsx";

export default function FavoritesPage() {
  const router = useRouter();
  
  // Имитация данных
  const [favorites] = useState(slotsData.slice(0, 6));
  const [preferences] = useState(slotsData.slice(6, 12));
  const [recommendations] = useState(slotsData.slice(12, 18));

  const [infoItem, setInfoItem] = useState<PlayCardItem | null>(null);
  const handleInfoClick = useCallback((item: PlayCardItem) => {
    setInfoItem(item);
  }, []);
  const closeInfo = useCallback(() => setInfoItem(null), []);

  const handleGameClick = (slug: string) => {
    router.push(`/game/${slug}`);
  };

  return (
    <div className={clsx("container", styles.favoritesPage)}>
      
      {/* --- SECTION 1: FAVORITES --- */}
      <section className={styles.section}>
        <div className={styles.headerWrapper}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.emoji}>⭐</span> My Favorites
          </h2>
          <div className={styles.countBadge}>{favorites.length} Games</div>
        </div>

        {favorites.length > 0 ? (
          <div className={styles.grid}>
            {favorites.map((slot) => (
              <div
                key={slot.id}
                className={styles.cardHover}
                onClick={() => handleGameClick(slot.slug)}
              >
                <PlayCard
                  item={{
                    id: slot.id,
                    title: slot.title,
                    imageSrc: slot.imageSrc,
                    linkHref: `/game/${slot.slug}`,
                    slug: slot.slug,
                  }}
                  onInfoClick={handleInfoClick}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💔</div>
            <h2>No favorites yet</h2>
            <p>It looks like you haven't added any games to your favorites yet.</p>
            <button
              className={styles.goHomeBtn}
              onClick={() => router.push("/")}
            >
              Go to Games
            </button>
          </div>
        )}
      </section>

      {/* --- SECTION 2: BASED ON PREFERENCES --- */}
      <section className={styles.section}>
        <div className={styles.headerWrapper}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.emoji}>🕵️‍♂️</span> Based on Preferences
          </h2>
          <div className={styles.countBadge}>{preferences.length} Games</div>
        </div>

        {preferences.length > 0 ? (
          <div className={styles.grid}>
            {preferences.map((slot) => (
              <div
                key={slot.id}
                className={styles.cardHover}
                onClick={() => handleGameClick(slot.slug)}
              >
                <PlayCard
                  item={{
                    id: slot.id,
                    title: slot.title,
                    imageSrc: slot.imageSrc,
                    linkHref: `/game/${slot.slug}`,
                    slug: slot.slug,
                  }}
                  onInfoClick={handleInfoClick}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyStateSimple}>
            <h2>We are learning your taste... 🕵️‍♂️</h2>
            <p>Play more games to get personalized recommendations.</p>
          </div>
        )}
      </section>

      {/* --- SECTION 3: RECOMMENDATIONS --- */}
      {recommendations.length > 0 && (
        <section className={styles.section}>
          <div className={styles.headerWrapper}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.emoji}>🔥</span> Recommendations
            </h2>
            <div className={styles.countBadge}>{recommendations.length} Games</div>
          </div>

          <div className={styles.grid}>
            {recommendations.map((slot) => (
              <div
                key={slot.id}
                className={styles.cardHover}
                onClick={() => handleGameClick(slot.slug)}
              >
                <PlayCard
                  item={{
                    id: slot.id,
                    title: slot.title,
                    imageSrc: slot.imageSrc,
                    linkHref: `/game/${slot.slug}`,
                    slug: slot.slug,
                  }}
                  onInfoClick={handleInfoClick}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <GameInfoModal
        isOpen={Boolean(infoItem)}
        onClose={closeInfo}
        data={infoItem ? resolveGameInfoForModal(infoItem) : null}
      />
    </div>
  );
}
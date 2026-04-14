"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import type { IconType } from "react-icons";
import {
  FaDice,
  FaStar,
  FaThLarge,
  FaTrophy,
  FaVideo,
} from "react-icons/fa";
import styles from "./page.module.scss";
import { IoTrophyOutline } from "react-icons/io5";
import {
  tournamentsData,
  TOURNAMENT_CATEGORY_FILTERS,
  type TournamentCategoryId,
} from "@/data/tournamentsData";
import TournamentCard from "@/components/TournamentCard";

const CATEGORY_ICONS: Record<TournamentCategoryId | "all", IconType> = {
  all: FaThLarge,
  slots: FaDice,
  live: FaVideo,
  weekly: FaTrophy,
  vip: FaStar,
};

export default function TournamentsPage() {
  const [activeCategory, setActiveCategory] = useState<
    TournamentCategoryId | "all"
  >("all");

  const filteredTournaments = useMemo(() => {
    if (activeCategory === "all") return tournamentsData;
    return tournamentsData.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className={styles.tournamentsPage}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <div className={styles.titleRow}>
              <IoTrophyOutline className={styles.titleIcon} aria-hidden />
              <h1 className={styles.pageTitle}>Турниры</h1>
            </div>
          </div>

          <div
            className={styles.categories}
            role="tablist"
            aria-label="Категории турниров"
          >
            {TOURNAMENT_CATEGORY_FILTERS.map((item) => {
              const Icon = CATEGORY_ICONS[item.id];
              const isActive = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={clsx(styles.categoryChip, isActive && styles.active)}
                  onClick={() => setActiveCategory(item.id)}
                >
                  <Icon className={styles.categoryChipIcon} size={14} aria-hidden />
                  <span className={styles.categoryChipLabel}>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.tournamentsGrid}>
            {filteredTournaments.length === 0 ? (
              <p className={styles.emptyList}>
                В этой категории пока нет турниров.
              </p>
            ) : (
              filteredTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

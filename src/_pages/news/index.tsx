"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import type { IconType } from "react-icons";
import {
  FaDice,
  FaGift,
  FaNewspaper,
  FaThLarge,
  FaTrophy,
} from "react-icons/fa";
import styles from "./page.module.scss";
import NewsItem from "@/components/News/News";
import {
  NEWS_CATEGORY_FILTERS,
  newsData,
  type NewsCategoryId,
} from "@/data/newsData";
import { IoNewspaperOutline } from "react-icons/io5";

const CATEGORY_ICONS: Record<NewsCategoryId | "all", IconType> = {
  all: FaThLarge,
  promotions: FaGift,
  tournaments: FaTrophy,
  games: FaDice,
  updates: FaNewspaper,
};

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<NewsCategoryId | "all">(
    "all",
  );

  const filteredNews = useMemo(() => {
    if (activeCategory === "all") return newsData;
    return newsData.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className={styles.newsPage}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <IoNewspaperOutline className={styles.icon} aria-hidden />
            <h1 className={styles.title}>Все новости</h1>
          </div>

          <div
            className={styles.categories}
            role="tablist"
            aria-label="Категории новостей"
          >
            {NEWS_CATEGORY_FILTERS.map((item) => {
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

          <div className={styles.grid}>
            {filteredNews.length === 0 ? (
              <p className={styles.emptyList}>
                В этой категории пока нет новостей.
              </p>
            ) : (
              filteredNews.map((item) => (
                <NewsItem key={item.id} item={item} showReadMore={true} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

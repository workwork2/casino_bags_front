"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./New.module.scss"; // Проверьте имя вашего файла стилей!

import type { NewsCategoryId } from "@/data/newsData";

export interface NewsItemType {
  id: number;
  category?: NewsCategoryId;
  // Ваши старые поля
  stepTime?: string | number;
  stepTitle?: string;
  description?: string;
  imageSrc?: string;
  linkHref?: string;
  // Новые поля (на всякий случай, если база будет меняться)
  title?: string;
  date?: string;
  desc?: string;
  img?: string;
}

interface NewsProps {
  item: NewsItemType;
  showReadMore?: boolean;
}

const NewsItem: React.FC<NewsProps> = ({ item, showReadMore = false }) => {
  // Универсальные переменные, чтобы компонент переваривал любой формат данных
  const title = item.title || item.stepTitle || "Новость";
  const date = item.date || item.stepTime || "";
  const desc = item.desc || item.description || "";
  const imgSrc = item.img || item.imageSrc || "/placeholder.jpg";
  const link = item.linkHref || `/news/${item.id}`;

  return (
    <Link href={link} className={styles.newsLink}>
      <div className={styles.card}>
        
        {/* Шапка карточки */}
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>{title}</span>
          <span className={styles.cardDate}>{date}</span>
        </div>

        {/* Картинка */}
        <div className={styles.imgWrap}>
          <Image
            src={imgSrc}
            alt={title}
            fill // Растягиваем на всю ширину/высоту блока (потребует position: relative в CSS)
            className={styles.image}
          />
        </div>

        {/* Текстовая часть */}
        <div className={styles.content}>
          <p className={styles.desc}>{desc}</p>

          {showReadMore && (
            <div className={styles.readMore}>
              Подробнее
            </div>
          )}
        </div>
        
      </div>
    </Link>
  );
};

export default NewsItem;
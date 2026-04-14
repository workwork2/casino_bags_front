"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoNewspaperOutline, IoChevronBack, IoChevronForward } from "react-icons/io5"; 
import { newsData } from "@/data/newsData"; 
import styles from "./CarouselNews.module.scss"; 

interface CarouselNewsProps {
  currentId?: number;
}

export default function CarouselNews({ currentId }: CarouselNewsProps) {
  const displayList = currentId
    ? newsData.filter((item) => item.id !== currentId)
    : newsData;

  const topThreeNews = displayList.slice(0, 3);
  
  // Создаем ссылку на контейнер с карточками для ручного скролла
  const scrollRef = useRef<HTMLDivElement>(null);

  // Функция для прокрутки по клику на стрелки
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      // Прокручиваем ровно на ширину контейнера (т.е. на 1 карточку)
      const scrollAmount = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className={styles.wrapper}>
      {/* Шапка блока */}
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <IoNewspaperOutline className={styles.icon} />
          <h2 className={styles.title}>Новости</h2>
        </div>
        
        {/* Кнопка для десктопа */}
        <Link href="/news" className={styles.viewAllBtn}>
          Смотреть все
        </Link>

        {/* Стрелки для мобильных устройств (скрыты на ПК) */}
        <div className={styles.mobileArrows}>
          <button onClick={() => scroll("left")} className={styles.arrowBtn}>
            <IoChevronBack />
          </button>
          <button onClick={() => scroll("right")} className={styles.arrowBtn}>
            <IoChevronForward />
          </button>
        </div>
      </div>

      {/* Сетка карточек */}
      <div className={styles.grid} ref={scrollRef}>
        {topThreeNews.map((item) => (
          <div key={item.id} className={styles.card}>
            
            <div className={styles.cardHeader}>
              {/* Подтягиваем правильные ключи заголовка и даты */}
              <span className={styles.cardTitle}>{item.stepTitle || item.title}</span>
              <span className={styles.cardDate}>{item.stepTime || item.date}</span>
            </div>

            <div className={styles.imgWrap}>
              <Image
                /* Подтягиваем правильный ключ для фото (imageSrc) */
                src={item.imageSrc || item.image || item.img || "/placeholder.jpg"} 
                alt={item.stepTitle || item.title || "news image"}
                fill 
                className={styles.image}
              />
            </div>

            <div className={styles.content}>
              {/* Подтягиваем правильный ключ для описания */}
              <p className={styles.desc}>
                {item.description || item.fullDescription || item.desc}
              </p>
              <Link href={`/news/${item.id}`} className={styles.readMore}>
                Подробнее
              </Link>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
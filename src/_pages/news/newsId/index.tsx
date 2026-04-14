"use client";

import Image from "next/image";
import Link from "next/link";
import { IoChevronBack } from "react-icons/io5";
import styles from "./NewsId.module.scss";

import { newsData } from "@/data/newsData";
import CarouselNews from "@/components/CarouselNews/CarouselNews";

// ВОТ ТУТ ВЕРНУЛИ ТВОЙ ИСХОДНЫЙ ВАРИАНТ ПРОПСОВ: { id }: { id: number }
export default function NewsIdPage({ id }: { id: number }) {
  
  // Ищем текущую новость
  const currentNews = newsData.find((item) => item.id === id);

  if (!currentNews || !id) {
    return (
      <div className={styles.notFound}>
        <h1>Новость не найдена</h1>
        <Link href="/news" className={styles.backLink}>
          Вернуться к новостям
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.wrapper}>
        
        {/* Кнопка "Назад" */}
        <div className={styles.topHeader}>
          <Link href="/news" className={styles.backLink}>
            <IoChevronBack className={styles.backIcon} />
            К новостям
          </Link>
        </div>

        {/* Область самой статьи в стеклянном стиле */}
        <article className={styles.articleWrapper}>
          <div className={styles.date}>
            {currentNews.stepTime || currentNews.date}
          </div>

          <h1 className={styles.newsTitle}>
            {currentNews.stepTitle || currentNews.title}
          </h1>

          <div className={styles.heroImageWrapper}>
            <Image
              src={currentNews.imageSrc || currentNews.img || "/placeholder.jpg"}
              alt={currentNews.stepTitle || currentNews.title || "News image"}
              width={1200}
              height={500}
              className={styles.heroImage}
            />
          </div>

          <div className={styles.textContent}>
            <p className={styles.paragraph}>
              {currentNews.fullDescription || currentNews.description}
            </p>

            {currentNews.features && (
              <ul className={styles.featureList}>
                {currentNews.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            )}
          </div>
        </article>

        {/* Слайдер с другими новостями */}
        <div className={styles.moreNewsSection}>
          <CarouselNews currentId={id} />
        </div>
        
      </div>
    </div>
  );
}
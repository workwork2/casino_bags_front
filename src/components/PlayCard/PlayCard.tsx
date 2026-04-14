'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './PlayCard.module.scss';

import { FaPlay } from "react-icons/fa";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
// Используем красивый, современный знак вопроса со сбалансированной жирностью
import { BsQuestionLg } from "react-icons/bs";
import type { PlayCardItem } from "@/shared/types/playCard";

export type { PlayCardItem, PlayCardInfoOverrides } from "@/shared/types/playCard";

interface PlayCardProps {
  item: PlayCardItem;
  onInfoClick: (item: PlayCardItem) => void;
}

const PlayCard: React.FC<PlayCardProps> = ({ item, onInfoClick }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleInfoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onInfoClick(item);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className={styles.card}>
      <Link href={item.linkHref} className={styles.linkWrapper}>
        <div className={styles.imageContainer}>
          <Image
            src={item.imageSrc}
            alt={item.title || 'Slot Game'}
            fill
            sizes="(max-width: 600px) 50vw, (max-width: 900px) 34vw, (max-width: 1200px) 25vw, 17vw"
            className={styles.image}
          />

          <div className={styles.overlay}>
            {/* Розовое сердечко */}
            <div className={styles.heartIcon} onClick={handleLikeClick}>
              {isLiked ? (
                <IoMdHeart className={styles.heartSvg} color="#ff2e93" />
              ) : (
                <IoMdHeartEmpty className={styles.heartSvg} color="#ffffff" />
              )}
            </div>

            <div className={styles.playButton}>
              <FaPlay className={styles.playGlyph} color="#ffffff" />
              <span className={styles.playText}>Play</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Красивая кнопка инфо с эффектом стекла */}
      <button
        className={styles.infoButton}
        onClick={handleInfoClick}
        type='button'
      >
        <BsQuestionLg color="#ffffff" className={styles.questionIcon} />
      </button>
    </div>
  );
};

export default PlayCard;
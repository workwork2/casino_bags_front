"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoChevronDown, IoChevronBack, IoTrophyOutline } from "react-icons/io5";
import styles from "./page.module.scss";
import { tournamentsData } from "@/data/tournamentsData";

export default function TournamentIdPage({ id }: { id: number }) {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const currentTournament = tournamentsData.find((item) => item.id === id);

  if (!currentTournament || Number.isNaN(id)) {
    return (
      <div className={styles.detailPage}>
        <div className="container">
          <div className={styles.notFoundWrapper}>
            <h1 className={styles.notFoundTitle}>Турнир не найден</h1>
            <Link href="/tournaments" className={styles.backLink}>
              Вернуться к списку
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isSvg = currentTournament.imageSrc.toLowerCase().endsWith(".svg");

  const renderPlace = (place: number) => {
    if (place === 1) return <span>🥇</span>;
    if (place === 2) return <span>🥈</span>;
    if (place === 3) return <span>🥉</span>;
    return <span>{place}</span>;
  };

  return (
    <div className={styles.detailPage}>
      <div className="container">
        <Link href="/tournaments" className={styles.backNav}>
          <IoChevronBack className={styles.backNavIcon} aria-hidden />
          К списку турниров
        </Link>

        <div className={styles.stack}>
          <section className={styles.heroSection}>
            <div className={styles.detailCard}>
              <div className={styles.bgLayer}>
                <Image
                  src={currentTournament.imageSrc}
                  alt={currentTournament.title}
                  fill
                  unoptimized={isSvg}
                  className={`${styles.detailCoverImage} ${isSvg ? styles.detailCoverSvg : ""}`}
                  sizes="(max-width: 768px) 100vw, min(1100px, 100vw)"
                  priority
                />
                <div className={styles.heroGradient} />
              </div>

              <div className={styles.heroContent}>
                <div className={styles.titleRow}>
                  <span className={styles.titleIconWrap}>
                    <IoTrophyOutline className={styles.titleIcon} aria-hidden />
                  </span>
                  <h1 className={styles.tournamentTitle}>
                    {currentTournament.title}
                  </h1>
                </div>
                <p className={styles.prizeLabel}>Призовой фонд</p>
                <p className={styles.prizeValue}>{currentTournament.prizePool}</p>
              </div>
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.rulesGrid}>
              <div className={styles.ruleCard}>
                <span className={styles.ruleKey}>Даты</span>
                <p className={styles.ruleVal}>{currentTournament.dates}</p>
              </div>
              <div className={styles.ruleCard}>
                <span className={styles.ruleKey}>Мин. ставка</span>
                <p className={styles.ruleVal}>{currentTournament.minBet}</p>
              </div>
              <div className={`${styles.ruleCard} ${styles.ruleCardWide}`}>
                <span className={styles.ruleKey}>Как получить очки</span>
                <p className={styles.ruleVal}>{currentTournament.scoringRules}</p>
              </div>
            </div>
            <button type="button" className={styles.actionButton}>
              Участвовать
            </button>
          </section>

          <section
            className={`${styles.accordionCard} ${isTermsOpen ? styles.open : ""}`}
          >
            <button
              type="button"
              className={styles.cardHeader}
              onClick={() => setIsTermsOpen(!isTermsOpen)}
              aria-expanded={isTermsOpen}
            >
              <span className={styles.cardHeaderLabel}>Условия и положения</span>
              <IoChevronDown
                className={`${styles.chevron} ${isTermsOpen ? styles.chevronOpen : ""}`}
                aria-hidden
              />
            </button>
            <div className={styles.collapsibleContent}>
              <div className={styles.termsWrapper}>
                <div className={styles.innerContent}>
                  {currentTournament.terms.map((term, index) => (
                    <p key={index} className={styles.termLine}>
                      <span className={styles.termNum}>{index + 1}.</span> {term}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            className={`${styles.accordionCard} ${isLeaderboardOpen ? styles.open : ""}`}
          >
            <button
              type="button"
              className={styles.cardHeader}
              onClick={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
              aria-expanded={isLeaderboardOpen}
            >
              <span className={styles.cardHeaderLabel}>Таблица лидеров</span>
              <IoChevronDown
                className={`${styles.chevron} ${isLeaderboardOpen ? styles.chevronOpen : ""}`}
                aria-hidden
              />
            </button>
            <div className={styles.collapsibleContent}>
              <div className={styles.leaderboardWrapper}>
                <div className={styles.tableHeader}>
                  <span>Место</span>
                  <span>Игрок</span>
                  <span>Приз</span>
                </div>
                <div className={styles.tableBody}>
                  {currentTournament.leaderboard.length > 0 ? (
                    currentTournament.leaderboard.map((user) => (
                      <div
                        key={user.place}
                        className={`${styles.row} ${user.isTop ? styles.topRow : ""}`}
                      >
                        <div className={styles.placeCell}>
                          {renderPlace(user.place)}
                        </div>
                        <div className={styles.nameCell}>{user.name}</div>
                        <div className={styles.prizeCell}>{user.prize}</div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyState}>Участников пока нет</div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { IoArrowForward, IoTimeOutline } from "react-icons/io5";
import styles from "./page.module.scss";
import {
  Tournament,
  TOURNAMENT_CATEGORY_FILTERS,
} from "@/data/tournamentsData";

const TournamentCard: React.FC<{ tournament: Tournament }> = ({
  tournament,
}) => {
  const { timer } = tournament;
  const categoryLabel =
    TOURNAMENT_CATEGORY_FILTERS.find((c) => c.id === tournament.category)
      ?.label ?? "Турнир";

  const isSvg = tournament.imageSrc.toLowerCase().endsWith(".svg");

  return (
    <Link href={`/tournaments/${tournament.id}`} className={styles.card}>
      <div className={styles.bgLayer}>
        <Image
          src={tournament.imageSrc}
          alt={tournament.title}
          fill
          unoptimized={isSvg}
          className={`${styles.coverImage} ${isSvg ? styles.coverSvg : ""}`}
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={85}
        />
        <div className={styles.gradientOverlay} />
      </div>

      <div className={styles.content}>
        <div className={styles.topInfo}>
          <h2 className={styles.title}>{tournament.title}</h2>

          <div className={styles.prizeBlock}>
            <span className={styles.prizeLabel}>Призовой фонд</span>
            <div className={styles.prizeValue}>{tournament.prizePool}</div>
          </div>
        </div>

        <div className={styles.bottomBlock}>
          <div className={styles.timerBadge}>
            <IoTimeOutline className={styles.timerIcon} aria-hidden />
            <span>
              Осталось: {timer.days}д {timer.hours}ч
            </span>
          </div>

          <div className={styles.bottomRow}>
            <span className={styles.tournamentType}>{categoryLabel}</span>
            <span className={styles.moreBtn}>
              Подробнее
              <IoArrowForward className={styles.moreIcon} aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TournamentCard;

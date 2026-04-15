// "use client";

// import React, { useMemo, useRef } from "react";
// import styles from "./page.module.scss";
// import {
//   IoChevronBack,
//   IoChevronForward,
//   IoRibbonOutline,
// } from "react-icons/io5";

// import LoyaltyHero from "@/components/LoyaltyHero/LoyaltyHero";
// import StatusCard from "@/components/StatusCard/StatusCard";

// // Иконки и фоны (как у вас было)
// const levelVisuals: Record<number, { icon: string; bg: string }> = {
//   0: { icon: "/medal.svg", bg: "/card-bg.jpg" },
//   1: { icon: "/2loy.svg", bg: "/card-bg.jpg" },
//   2: { icon: "/crown-gold.svg", bg: "/card-bg.jpg" },
//   3: { icon: "/crown-royal.svg", bg: "/card-bg.jpg" },
// };

// // ==========================================
// // 🛑 ФЕЙКОВЫЕ ДАННЫЕ ДЛЯ ТЕСТА ДИЗАЙНА 🛑
// // ==========================================
// const mockData = {
//   user: { username: "Player777" },
//   progress: {
//     currentWagerUsd: 3500, // Сколько уже отыграл (текущий прогресс)
//     targetWagerUsd: 10000, // Сколько нужно до следующего уровня
//     currentLevel: 1,       // Текущий уровень (1 - Classic)
//     nextLevelName: "Gold", // Имя следующего уровня
//   },
//   levels: [
//     { level: 0, name: "Guest", wagerRequired: 0, rakebackRate: 0 },
//     { level: 1, name: "Classic", wagerRequired: 10000, rakebackRate: 0.05 },
//     { level: 2, name: "Gold", wagerRequired: 50000, rakebackRate: 0.08 },
//     { level: 3, name: "VIP", wagerRequired: 100000, rakebackRate: 0.1 },
//   ]
// };

// export default function LoyaltyPage() {
//   // КОММЕНТИРУЕМ REDUX ДО ПОЧИНКИ БЭКЕНДА
//   // const dispatch = useDispatch<AppDispatch>();
//   // const { data, isLoading, error } = useSelector((state: RootState) => state.vip);
//   // useEffect(() => { dispatch(fetchVipData()); }, [dispatch]);

//   const scrollRef = useRef<HTMLDivElement>(null);

//   const scroll = (direction: "left" | "right") => {
//     if (scrollRef.current) {
//       const scrollAmount = scrollRef.current.offsetWidth;
//       scrollRef.current.scrollBy({
//         left: direction === "left" ? -scrollAmount : scrollAmount,
//         behavior: "smooth",
//       });
//     }
//   };

//   // Читаем из ФЕЙКОВЫХ данных (позже замените mockData на data)
//   const heroData = useMemo(() => {
//     return {
//       currentPoints: mockData.progress.currentWagerUsd,
//       maxPoints: mockData.progress.targetWagerUsd,
//       userName: mockData.user.username,
//       nextLevelName: mockData.progress.nextLevelName,
//       imageSrc: levelVisuals[mockData.progress.currentLevel]?.icon || "/medal.svg",
//     };
//   }, []);

//   // Читаем из ФЕЙКОВЫХ данных (позже замените mockData на data)
//   const levelsData = useMemo(() => {
//     return mockData.levels.map((lvl) => {
//       const visual = levelVisuals[lvl.level] || levelVisuals[0];
//       const isReached = mockData.progress.currentLevel > lvl.level;
//       const isCurrentLevel = mockData.progress.currentLevel === lvl.level;
//       const isNextTarget = mockData.progress.currentLevel + 1 === lvl.level;

//       let currentMoney = 0;
//       if (isReached || isCurrentLevel) {
//         currentMoney = mockData.progress.currentWagerUsd;
//       } else if (isNextTarget) {
//         currentMoney = mockData.progress.currentWagerUsd;
//       }

//       const maxWagerForCard = lvl.level === 0 ? mockData.levels[1]?.wagerRequired || 10000 : lvl.wagerRequired;

//       return {
//         title: lvl.name,
//         iconSrc: visual.icon,
//         bgSrc: visual.bg,
//         currentMoney: Math.min(currentMoney, maxWagerForCard),
//         targetMoney: maxWagerForCard,
//         maxProgress: maxWagerForCard,
//         isCurrentLevel,
//         benefits: [
//           { label: "Кешбэк за неделю", value: `${(lvl.rakebackRate * 100).toFixed(1)}%`, isAvailable: lvl.rakebackRate > 0 },
//           { label: "Бонус на депозит", value: "✓", isAvailable: lvl.level > 0 },
//           { label: "Бесплатный турнир", isAvailable: lvl.level >= 2 },
//           { label: "Персональный менеджер", isAvailable: lvl.level >= 3 },
//         ],
//       };
//     });
//   }, []);

//   return (
//     <div className={styles.loyaltyPage}>
//       <div className="container">
//         <LoyaltyHero
//           currentPoints={heroData.currentPoints}
//           maxPoints={heroData.maxPoints}
//           userName={heroData.userName}
//           nextLevelName={heroData.nextLevelName}
//           imageSrc={heroData.imageSrc}
//         />

//         <section className={styles.wrapper}>
//           <div className={styles.header}>
//             <div className={styles.titleWrap}>
//               <IoRibbonOutline className={styles.titleIcon} aria-hidden />
//               <h2 className={styles.title}>Статусы</h2>
//             </div>

//             <div className={styles.mobileArrows}>
//               <button type="button" onClick={() => scroll("left")} className={styles.arrowBtn}>
//                 <IoChevronBack />
//               </button>
//               <button type="button" onClick={() => scroll("right")} className={styles.arrowBtn}>
//                 <IoChevronForward />
//               </button>
//             </div>
//           </div>

//           <div className={styles.grid} ref={scrollRef}>
//             {levelsData.map((level, idx) => (
//               <div key={idx} className={styles.cardCol}>
//                 <StatusCard {...level} />
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useMemo, useRef } from "react";
import styles from "./page.module.scss";
import {
  IoChevronBack,
  IoChevronForward,
  IoRibbonOutline,
} from "react-icons/io5";

import LoyaltyHero from "@/components/LoyaltyHero/LoyaltyHero";
import StatusCard from "@/components/StatusCard/StatusCard";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/shared/lib/redux/store";
import { fetchVipData } from "@/entities/vip/model/vipSlice";

// Иконки и фоны — полностью из первого варианта (дизайн не меняется)
const levelVisuals: Record<number, { icon: string; bg: string }> = {
  0: { icon: "/medal.svg", bg: "/card-bg.jpg" },
  1: { icon: "/2loy.svg", bg: "/card-bg.jpg" },
  2: { icon: "/crown-gold.svg", bg: "/card-bg.jpg" },
  3: { icon: "/crown-royal.svg", bg: "/card-bg.jpg" },
};

export default function LoyaltyPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, error } = useSelector(
    (state: RootState) => state.vip,
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Загружаем реальные данные из Redux (функциональность из второго варианта)
  useEffect(() => {
    dispatch(fetchVipData());
  }, [dispatch]);

  // heroData — адаптировано под данные из vip-слайса, но структура и пропсы точно как в первом варианте
  const heroData = useMemo(() => {
    if (!data) {
      return {
        currentPoints: 0,
        maxPoints: 10000,
        userName: "Player777",
        nextLevelName: "Gold",
        imageSrc: "/medal.svg",
      };
    }
    return {
      currentPoints: data.progress?.currentPoints ?? 0,
      maxPoints: data.progress?.targetPoints ?? 10000,
      userName: data.user?.username ?? "Player",
      nextLevelName: data.progress?.nextLevelName ?? "—",
      imageSrc: levelVisuals[data.progress?.currentLevel]?.icon || "/medal.svg",
    };
  }, [data]);

  // levelsData — полностью адаптировано под новую структуру бэкенда (CP, weeklyCashbackRate и т.д.)
  // но пропсы и логика отображения прогресса/бенефитов оставлены совместимыми с первым вариантом
  const levelsData = useMemo(() => {
    if (!data || !data.levels || data.levels.length === 0) return [];
    const userPoints = data.progress.currentPoints;
    const currentLevel = data.progress?.currentLevel;

    return data.levels.map((lvl: any) => {
      const visual = levelVisuals[lvl.level] || levelVisuals[0];

      const isCompleted = userPoints >= lvl.cpRequired;
      const isCurrentLevel = currentLevel === lvl.level;

      // Прогресс-логика из второго варианта (самая корректная для CP-системы)
      const currentMoney = isCompleted ? lvl.cpRequired : userPoints;

      return {
        title: lvl.name,
        iconSrc: visual.icon,
        bgSrc: visual.bg,
        currentMoney,
        targetMoney: lvl.cpRequired,
        maxProgress: lvl.cpRequired,
        isCurrentLevel, // используется в StatusCard первого варианта для .activeCard
        benefits: [
          {
            label: "Кешбэк за неделю",
            value: `${(lvl.weeklyCashbackRate * 100).toFixed(1)}%`,
            isAvailable: lvl.weeklyCashbackRate > 0,
          },
          {
            label: "Бонус на депозит",
            value:
              lvl.depositBonusMultiplier > 1
                ? `+${((lvl.depositBonusMultiplier - 1) * 100).toFixed(0)}%`
                : "✓",
            isAvailable: lvl.depositBonusMultiplier > 1,
          },
          {
            label: "Бесплатный турнир",
            value:
              lvl.freeTournamentGames > 0
                ? `${lvl.freeTournamentGames}`
                : undefined,
            isAvailable: lvl.freeTournamentGames > 0,
          },
          {
            label: "Персональный менеджер",
            value: "✓",
            isAvailable: lvl.hasPersonalManager,
          },
        ],
      };
    });
  }, [data]);

  // Дизайн первого варианта полностью сохранён (включая стрелки, grid, scrollRef, заголовок "Статусы" и т.д.)
  // Добавлена только функциональность Redux + обработка загрузки/ошибки
  return (
    <div className={styles.loyaltyPage}>
      <div className="container">
        {isLoading && (
          <div
            style={{ color: "white", textAlign: "center", padding: "100px 0" }}
          >
            Загрузка данных лояльности...
          </div>
        )}
        {error && (
          <div
            style={{ color: "red", textAlign: "center", padding: "100px 0" }}
          >
            Ошибка: {error}
          </div>
        )}

        {!isLoading && !error && data && (
          <>
            <LoyaltyHero
              currentPoints={heroData.currentPoints}
              maxPoints={heroData.maxPoints}
              userName={heroData.userName}
              nextLevelName={heroData.nextLevelName}
              imageSrc={heroData.imageSrc}
            />

            <section className={styles.wrapper}>
              <div className={styles.header}>
                <div className={styles.titleWrap}>
                  <IoRibbonOutline className={styles.titleIcon} aria-hidden />
                  <h2 className={styles.title}>Статусы</h2>
                </div>

                <div className={styles.mobileArrows}>
                  <button
                    type="button"
                    onClick={() => scroll("left")}
                    className={styles.arrowBtn}
                  >
                    <IoChevronBack />
                  </button>
                  <button
                    type="button"
                    onClick={() => scroll("right")}
                    className={styles.arrowBtn}
                  >
                    <IoChevronForward />
                  </button>
                </div>
              </div>

              <div className={styles.grid} ref={scrollRef}>
                {levelsData.map((level, idx) => (
                  <div key={idx} className={styles.cardCol}>
                    <StatusCard {...level} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

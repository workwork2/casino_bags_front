"use client";
import React, { useState } from "react";
import styles from "./GameNavigation.module.scss";
import CategoryDropdown from "../CategoryDropdown/CategoryDropdown";

import {
  FaSearch,
  FaThLarge,
  FaDice,
  FaVideo,
  FaTable,
  FaTrophy,
  FaStar,
  FaCopyright,
  FaHome,
  FaLayerGroup,
  FaGamepad,
  FaBolt,
  FaFire,
  FaGift,
  FaRocket,
  FaRandom,
} from "react-icons/fa";
import { CurrencyIcon } from "@/shared/ui/CurrencyIcon/CurrencyIcon";

interface CategoryItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const gameTypes: CategoryItem[] = [
  { id: "all", label: "All categories", icon: <FaThLarge /> },
  { id: "slots", label: "Slots", icon: <FaDice /> },
  { id: "live", label: "Live casino", icon: <FaVideo /> },
  { id: "tables", label: "Tables", icon: <FaTable /> },
  { id: "jackpots", label: "Jackpots", icon: <FaTrophy /> },
  { id: "crypto", label: "Crypto-games", icon: <CurrencyIcon symbol="BTC" size={14} variant="ui" /> },
  { id: "exclusive", label: "Exclusive", icon: <FaStar /> },
  { id: "branded", label: "Branded", icon: <FaCopyright /> },
  { id: "lobby", label: "Lobby", icon: <FaHome /> },
  { id: "new", label: "New Games", icon: <FaBolt /> },
  { id: "popular", label: "Popular", icon: <FaFire /> },
  { id: "bonus-buy", label: "Bonus Buy", icon: <FaGift /> },
  { id: "crash", label: "Crash Games", icon: <FaRocket /> },
  { id: "megaways", label: "Megaways", icon: <FaRandom /> },
];

export const GameNavigation: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  return (
    <div className={styles.navigationContainer}>
      
      {/* --- ВЕРХНИЙ УРОВЕНЬ --- */}
      <div className={styles.headerRow}>
        
        {/* Заголовок */}
        <h2 className={styles.title}>
          <div className={styles.titleIconWrapper}>
            <FaGamepad className={styles.titleIcon} />
          </div>
          <span className={styles.titleText}>Game Type</span>
        </h2>
        
        {/* Контролы: Provider и Search */}
        <div className={styles.controlsRight}>
          <button className={styles.providerButton}>
            <FaLayerGroup className={styles.controlIcon} />
            <span className={styles.providerText}>Provider</span>
          </button>

          <div className={styles.searchWrapper}>
            <FaSearch className={styles.controlIconAbsolute} />
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      {/* --- НИЖНИЙ УРОВЕНЬ (ДЕСКТОП): Кнопки фильтрации --- */}
      <div className={styles.list}>
        {gameTypes.map((item) => (
          <button
            key={item.id}
            className={`${styles.chip} ${
              item.id === activeCategory ? styles.active : ""
            }`}
            onClick={() => setActiveCategory(item.id)}
          >
            <span className={styles.chipIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* --- ПЛАНШЕТ И МОБИЛКА: Компактный Select --- */}
      <div className={styles.mobileCategoryWrapper}>
        <CategoryDropdown 
          selectedId={activeCategory} 
          onSelect={(id) => setActiveCategory(id)} 
        />
      </div>

    </div>
  );
};

export default GameNavigation;


// "use client";
// import React, { useState, useMemo } from "react";
// import Image from "next/image";
// import styles from "./GameNavigation.module.scss";
// import CategoryDropdown from "../CategoryDropdown/CategoryDropdown";

// const SEARCH_ICON_SRC = "/search.svg";

// interface CategoryItem {
//   id: string;
//   label: string;
//   src: string;
//   alt: string;
// }

// const gameTypes: CategoryItem[] = [
//   { id: "all", label: "All categories", src: "/all.svg", alt: "all" },
//   { id: "slots", label: "Slots", src: "/slotss.svg", alt: "slots" },
//   { id: "live", label: "Live casino", src: "/live.svg", alt: "live" },
//   { id: "tables", label: "Tables", src: "/tables.svg", alt: "tables" },
//   { id: "jackpots", label: "Jackpots", src: "/jackpots.svg", alt: "jackpots" },
//   {
//     id: "crypto",
//     label: "Crypto-games",
//     src: "/cryptogame.svg",
//     alt: "crypto",
//   },
//   {
//     id: "exclusive",
//     label: "Exclusive",
//     src: "/exclusive.svg",
//     alt: "exclusive",
//   },
//   { id: "branded", label: "Branded", src: "/branded.svg", alt: "branded" },
//   { id: "lobby", label: "Lobby", src: "/exclusive.svg", alt: "lobby" },
//   { id: "all", label: "All categories", src: "/all.svg", alt: "all" },
//   { id: "slots", label: "Slots", src: "/slotss.svg", alt: "slots" },
//   { id: "live", label: "Live casino", src: "/live.svg", alt: "live" },
//   { id: "tables", label: "Tables", src: "/tables.svg", alt: "tables" },
//   { id: "jackpots", label: "Jackpots", src: "/jackpots.svg", alt: "jackpots" },
//   { id: "branded", label: "Branded", src: "/branded.svg", alt: "branded" },
//   { id: "lobby", label: "Lobby", src: "/exclusive.svg", alt: "lobby" },
// ];

// // Расширенные моковые данные провайдеров (как на скриншоте)
// const mockProviders = [
//   { name: "1x2 Network" },
//   { name: "1Spin4Win" },
//   { name: "3 Oaks Gaming" },
//   { name: "7777 gaming" },
//   { name: "AGT Software" },
//   { name: "Amatic", isTop: true },
//   { name: "Amusnet", isTop: true },
//   { name: "Apollo" },
//   { name: "AvatarUX" },
//   { name: "Aviatrix" },
//   { name: "Bee Fee" },
//   { name: "Belatra Games" },
//   { name: "B Gaming" },
//   { name: "BetSoft" },
//   { name: "Big Time Gaming" },
//   { name: "Booming Games" },
//   { name: "CT Interactive" },
//   { name: "CQ9" },
//   { name: "DigitainCG" },
//   { name: "EGT Digital" },
//   { name: "ELK studios" },
//   { name: "Endorphina", isTop: true },
//   { name: "Espresso Games" },
//   { name: "Evoplay" },
//   { name: "Fa Chai" },
//   { name: "Fugaso" },
//   { name: "Game Art" },
//   { name: "Igrosoft" },
//   { name: "ISoftbet" },
//   { name: "JDB" },
//   { name: "KA Gaming" },
//   { name: "Microgaming" },
//   { name: "NetEnt" },
//   { name: "Nolimit City" },
//   { name: "Play'n GO" },
//   { name: "Pragmatic Play", isTop: true },
//   { name: "Push Gaming" },
//   { name: "Relax Gaming" },
//   { name: "Spinomenal" },
//   { name: "Spribe" },
//   { name: "Yggdrasil" },
// ];

// export const GameNavigation: React.FC = () => {
//   const [activeCategory, setActiveCategory] = useState<string>("all");
//   const [mainSearchQuery, setMainSearchQuery] = useState<string>("");

//   // Состояния для модалки
//   const [isProvidersModalOpen, setIsProvidersModalOpen] =
//     useState<boolean>(false);
//   const [modalSearchQuery, setModalSearchQuery] = useState<string>("");

//   // Логика группировки провайдеров по алфавиту для модалки
//   const groupedProviders = useMemo(() => {
//     const filtered = mockProviders.filter((p) =>
//       p.name.toLowerCase().includes(modalSearchQuery.toLowerCase()),
//     );

//     // Сортируем по алфавиту
//     filtered.sort((a, b) => a.name.localeCompare(b.name));

//     const groups: { [key: string]: typeof mockProviders } = {};
//     filtered.forEach((provider) => {
//       const firstChar = provider.name.charAt(0).toUpperCase();
//       // Группируем цифры в одну группу "0-9" или оставляем как есть. Оставим как есть по скрину.
//       if (!groups[firstChar]) groups[firstChar] = [];
//       groups[firstChar].push(provider);
//     });

//     return groups;
//   }, [modalSearchQuery]);

//   return (
//     <div className={styles.navigationContainer}>
//       {/* --- HEADER BLOCK --- */}
//       <div className={styles.header}>
//         <div className={styles.headerLeft}>
//           <div className={styles.titleIndicator}></div>
//           <h2 className={styles.titleText}>{activeCategory}</h2>
//         </div>

//         <div className={styles.headerRight}>
//           <div className={styles.searchWrapper}>
//             <div className={styles.searchIcon}>
//               <Image
//                 src={SEARCH_ICON_SRC}
//                 alt="Search"
//                 width={20}
//                 height={20}
//               />
//             </div>
//             <input
//               type="text"
//               placeholder="Search games..."
//               value={mainSearchQuery}
//               onChange={(e) => setMainSearchQuery(e.target.value)}
//               className={styles.searchInput}
//             />
//           </div>

//           <button
//             className={styles.providersBtn}
//             onClick={() => setIsProvidersModalOpen(true)}
//           >
//             <span>Providers</span>
//             <div className={styles.providersIcon}>
//               <svg
//                 width="18"
//                 height="18"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <rect x="3" y="3" width="7" height="7"></rect>
//                 <rect x="14" y="3" width="7" height="7"></rect>
//                 <rect x="14" y="14" width="7" height="7"></rect>
//                 <rect x="3" y="14" width="7" height="7"></rect>
//               </svg>
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* --- CONTENT BLOCK (FILTERS) --- */}
//       <div className={styles.content}>
//         <div className={styles.list}>
//           {gameTypes.map((item) => (
//             <button
//               key={item.id}
//               className={`${styles.chip} ${item.id === activeCategory ? styles.active : ""}`}
//               onClick={() => setActiveCategory(item.id)}
//             >
//               <div className={styles.icon}>
//                 <Image src={item.src} alt={item.alt} width={24} height={24} />
//               </div>
//               <span>{item.label}</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* --- MOBILE DROPDOWN --- */}
//       <div className={styles.mobileCategoryWrapper}>
//         <CategoryDropdown />
//       </div>

//       {/* --- PROVIDERS MODAL (Full Screen / Advanced) --- */}
//       {isProvidersModalOpen && (
//         <div
//           className={styles.modalOverlay}
//           onClick={() => setIsProvidersModalOpen(false)}
//         >
//           <div
//             className={styles.modalContainer}
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className={styles.modalHeader}>
//               <h3 className={styles.modalTitle}>Все провайдеры</h3>

//               <div className={styles.modalActions}>
//                 <div className={styles.modalSearchWrapper}>
//                   <Image
//                     src={SEARCH_ICON_SRC}
//                     alt="Search"
//                     width={16}
//                     height={16}
//                     className={styles.modalSearchIcon}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Найти провайдера"
//                     value={modalSearchQuery}
//                     onChange={(e) => setModalSearchQuery(e.target.value)}
//                     className={styles.modalSearchInput}
//                   />
//                 </div>
//                 <button
//                   className={styles.closeBtn}
//                   onClick={() => setIsProvidersModalOpen(false)}
//                 >
//                   <svg
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   >
//                     <line x1="18" y1="6" x2="6" y2="18"></line>
//                     <line x1="6" y1="6" x2="18" y2="18"></line>
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             {/* Modal Body (Columns) */}
//             <div className={styles.modalBody}>
//               <div className={styles.showAllRow}>
//                 <button className={styles.showAllBtn}>Показать всех</button>
//               </div>

//               <div className={styles.providersColumns}>
//                 {Object.keys(groupedProviders).map((letter) => (
//                   <div key={letter} className={styles.providerGroup}>
//                     {groupedProviders[letter].map((provider, index) => (
//                       <div key={provider.name} className={styles.providerItem}>
//                         {/* Показываем букву/цифру только у первого элемента в группе */}
//                         <span className={styles.providerLetter}>
//                           {index === 0 ? letter : ""}
//                         </span>
//                         <span className={styles.providerName}>
//                           {provider.name}
//                         </span>
//                         {provider.isTop && (
//                           <span className={styles.topBadge}>TOP</span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </div>

//               {Object.keys(groupedProviders).length === 0 && (
//                 <div className={styles.noResults}>Провайдеры не найдены</div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GameNavigation;

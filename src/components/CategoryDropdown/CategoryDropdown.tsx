'use client';

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './CategoryDropdown.module.scss';

import {
  FaChevronDown,
  FaThLarge,
  FaDice,
  FaVideo,
  FaTable,
  FaTrophy,
  FaStar,
  FaCopyright,
  FaHome,
  FaBolt,
  FaFire,
  FaGift,
  FaRocket,
  FaRandom,
} from 'react-icons/fa';
import { CurrencyIcon } from '@/shared/ui/CurrencyIcon/CurrencyIcon';

const gameTypes = [
  { id: 'all', label: 'All categories', icon: <FaThLarge /> },
  { id: 'slots', label: 'Slots', icon: <FaDice /> },
  { id: 'live', label: 'Live casino', icon: <FaVideo /> },
  { id: 'tables', label: 'Tables', icon: <FaTable /> },
  { id: 'jackpots', label: 'Jackpots', icon: <FaTrophy /> },
  {
    id: 'crypto',
    label: 'Crypto-games',
    icon: <CurrencyIcon symbol="BTC" size={16} variant="ui" />,
  },
  { id: 'exclusive', label: 'Exclusive', icon: <FaStar /> },
  { id: 'branded', label: 'Branded', icon: <FaCopyright /> },
  { id: 'lobby', label: 'Lobby', icon: <FaHome /> },
];

const popularGames = [
  { id: 'new', label: 'New Games', icon: <FaBolt /> },
  { id: 'popular', label: 'Popular', icon: <FaFire /> },
  { id: 'bonus-buy', label: 'Bonus Buy', icon: <FaGift /> },
  { id: 'crash', label: 'Crash Games', icon: <FaRocket /> },
  { id: 'megaways', label: 'Megaways', icon: <FaRandom /> },
];

interface CategoryDropdownProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

type MenuPos = { top: number; left: number; width: number };

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedId,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<MenuPos | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const updateMenuPosition = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMenuPos({
      top: r.bottom + 8,
      left: r.left,
      width: r.width,
    });
  };

  useLayoutEffect(() => {
    if (!isOpen) {
      setMenuPos(null);
      return;
    }
    updateMenuPosition();
    window.addEventListener('scroll', updateMenuPosition, true);
    window.addEventListener('resize', updateMenuPosition);
    return () => {
      window.removeEventListener('scroll', updateMenuPosition, true);
      window.removeEventListener('resize', updateMenuPosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const t = event.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((o) => !o);
  };

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsOpen(false);
  };

  const allItems = [...gameTypes, ...popularGames];
  const activeItem = allItems.find((item) => item.id === selectedId) || gameTypes[0];

  const menu =
    isOpen && menuPos && typeof document !== 'undefined' ? (
      <ul
        ref={menuRef}
        className={styles.dropdownMenu}
        style={{
          position: 'fixed',
          top: menuPos.top,
          left: menuPos.left,
          width: menuPos.width,
          zIndex: 10500,
        }}
        role="listbox"
        aria-label="Game categories"
      >
        <div className={styles.scrollContainer}>
          <div className={styles.groupLabel}>Game Type</div>
          {gameTypes.map((item) => (
            <li
              key={item.id}
              role="option"
              aria-selected={item.id === selectedId}
              className={`${styles.menuItem} ${item.id === selectedId ? styles.active : ''}`}
              onClick={() => handleSelect(item.id)}
            >
              <span className={styles.itemText}>{item.label}</span>
              <div className={styles.itemIcon}>{item.icon}</div>
            </li>
          ))}

          <div className={styles.divider} />

          <div className={styles.groupLabel}>Popular</div>
          {popularGames.map((item) => (
            <li
              key={item.id}
              role="option"
              aria-selected={item.id === selectedId}
              className={`${styles.menuItem} ${item.id === selectedId ? styles.active : ''}`}
              onClick={() => handleSelect(item.id)}
            >
              <span className={styles.itemText}>{item.label}</span>
              <div className={styles.itemIcon}>{item.icon}</div>
            </li>
          ))}
        </div>
      </ul>
    ) : null;

  return (
    <>
      <div className={styles.wrapper} ref={triggerRef}>
        <button
          type="button"
          className={`${styles.dropdownButton} ${isOpen ? styles.open : ''}`}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className={styles.buttonLabel}>
            <span className={styles.labelText}>{activeItem.label}</span>
          </div>

          <div className={styles.arrowIcon}>
            <FaChevronDown size={14} color="rgba(255, 255, 255, 0.5)" />
          </div>
        </button>
      </div>
      {menu ? createPortal(menu, document.body) : null}
    </>
  );
};

export default CategoryDropdown;

'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoCloseOutline } from 'react-icons/io5';
import styles from './BuregMenu.module.scss';
import {
  MAIN_NAV_ITEMS,
  NAV_ICON_SIZE,
  SUPPORT_NAV_ITEMS,
} from '@/shared/config/navigation';

interface BuregMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuregMenu: FC<BuregMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        className={styles.overlay}
        onClick={onClose}
        aria-label="Close menu"
      />
      <div className={styles.menuContainer}>
        <header className={styles.menuHeader}>
          <span className={styles.menuTitle}>Menu</span>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <IoCloseOutline size={26} />
          </button>
        </header>

        <div className={styles.scrollArea}>
          <nav className={styles.nav}>
            {MAIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.link;
              return (
                <Link
                  key={item.name}
                  href={item.link}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  onClick={onClose}
                >
                  <span className={styles.iconWrapper}>
                    <Icon size={NAV_ICON_SIZE} />
                  </span>
                  <span className={styles.navText}>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className={styles.divider} />

          <p className={styles.sectionLabel}>Support</p>
          <nav className={styles.nav}>
            {SUPPORT_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.link;
              return (
                <Link
                  key={item.name}
                  href={item.link}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  onClick={onClose}
                >
                  <span className={styles.iconWrapper}>
                    <Icon size={NAV_ICON_SIZE} />
                  </span>
                  <span className={styles.navText}>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default BuregMenu;

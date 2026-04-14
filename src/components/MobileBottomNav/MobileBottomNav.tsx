"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoGiftOutline,
  IoHomeOutline,
  IoTrophyOutline,
} from "react-icons/io5";
import { MdOutlineCasino, MdOutlineSportsEsports } from "react-icons/md";
import styles from "./MobileBottomNav.module.scss";

type BottomNavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
};

const MOBILE_NAV_ITEMS: BottomNavItem[] = [
  { label: "Home", href: "/", icon: IoHomeOutline },
  { label: "Slots", href: "/slots", icon: MdOutlineSportsEsports },
  { label: "Live", href: "/live-casino", icon: MdOutlineCasino },
  { label: "Bonuses", href: "/bonuses", icon: IoGiftOutline },
  { label: "Tournaments", href: "/tournaments", icon: IoTrophyOutline },
];

const isItemActive = (pathname: string, href: string): boolean => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

const MobileBottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.bottomNav} aria-label="Mobile navigation">
      {MOBILE_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isItemActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${active ? styles.active : ""}`}
          >
            <Icon size={22} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;

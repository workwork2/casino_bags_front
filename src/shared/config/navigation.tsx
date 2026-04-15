import type { IconType } from "react-icons";

import {
  IoDiamondOutline,
  IoGiftOutline,
  IoHomeOutline,
  IoTrophyOutline,
} from "react-icons/io5";
import { FaHandshake, FaHeadset } from "react-icons/fa";
import { MdOutlineCasino, MdOutlineSportsEsports } from "react-icons/md";
import { FiFileText, FiHelpCircle, FiSettings } from "react-icons/fi";

export type NavItem = {
  name: string;
  link: string;
  icon: IconType;
};

/** Основное меню (как в SlideBar / мобильном drawer) */
export const MAIN_NAV_ITEMS: NavItem[] = [
  { name: "Home", icon: IoHomeOutline, link: "/" },
  { name: "Bonuses", icon: IoGiftOutline, link: "/bonuses" },
  { name: "Slots", icon: MdOutlineSportsEsports, link: "/slots" },
  { name: "Live casino", icon: MdOutlineCasino, link: "/live-casino" },
  { name: "Tournaments", icon: IoTrophyOutline, link: "/tournaments" },
  { name: "Loyalty", icon: IoDiamondOutline, link: "/loyalty" },
  { name: "Partners", icon: FaHandshake, link: "/partners" },
];

export const SUPPORT_NAV_ITEMS: NavItem[] = [
  { name: "FAQ", icon: FiHelpCircle, link: "/faq" },
  { name: "News", icon: FiFileText, link: "/news" },
  { name: "Settings", icon: FiSettings, link: "/settings" },
  { name: "Support", icon: FaHeadset, link: "/support" },
];

/** Иконки навигации (сайдбар, бургер) */
export const NAV_ICON_SIZE = 24;

/** Иконки тулбара хедера — один размер со всем рядом */
export const HEADER_ICON_SIZE = 22;

/** Аватар в хедере (круг) */
export const HEADER_AVATAR_PX = 32;

/** Аватар в карточке профиля ЛК (круг, без сжатия — cover, фиксированный размер) */
export const PROFILE_HERO_AVATAR_PX = 72;

/** Аватар в карточке профиля (круг) */
export const ACCOUNT_AVATAR_PX = 80;

/** Пути «заглушек» — показываем ту же иконку, что в хедере без фото */
export const PLACEHOLDER_AVATAR_PATHS = ["/lc.svg"];

export function isPlaceholderAvatar(url: string | null | undefined): boolean {
  if (url == null || url === "") return true;
  return PLACEHOLDER_AVATAR_PATHS.includes(url);
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SlideBar.module.scss";
import {
  MAIN_NAV_ITEMS,
  NAV_ICON_SIZE,
  SUPPORT_NAV_ITEMS,
} from "@/shared/config/navigation";
import { APP_LAYOUT_MOBILE_MAX_PX } from "@/shared/config/layout";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { FaTelegramPlane, FaTwitter, FaDiscord } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";
import { TbRating18Plus } from "react-icons/tb";

const languages = ["EN", "RU", "ES"];

const SlideBar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOverlayMode, setIsOverlayMode] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");
  const prevOverlayModeRef = useRef<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const shouldUseOverlayMode =
        vw <= 1450 && vw > APP_LAYOUT_MOBILE_MAX_PX;
      setIsOverlayMode(shouldUseOverlayMode);

      if (vw <= APP_LAYOUT_MOBILE_MAX_PX) {
        setIsCollapsed(true);
        prevOverlayModeRef.current = false;
        return;
      }

      // При входе в режим <=1450 держим сайдбар в "закрытом" rail-состоянии.
      if (
        shouldUseOverlayMode &&
        (prevOverlayModeRef.current === null || !prevOverlayModeRef.current)
      ) {
        setIsCollapsed(true);
      }

      prevOverlayModeRef.current = shouldUseOverlayMode;
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Сдвигаем хедер и main под ширину сайдбара (без налезания)
  useEffect(() => {
    const applySidebarOffset = () => {
      const vw = window.innerWidth;
      if (vw <= APP_LAYOUT_MOBILE_MAX_PX) {
        document.documentElement.style.setProperty(
          "--app-sidebar-offset",
          "0px",
        );
      } else if (vw <= 1450) {
        document.documentElement.style.setProperty(
          "--app-sidebar-offset",
          "80px",
        );
      } else {
        document.documentElement.style.setProperty(
          "--app-sidebar-offset",
          isCollapsed ? "80px" : "260px",
        );
      }
    };
    applySidebarOffset();
    window.addEventListener("resize", applySidebarOffset);
    return () => window.removeEventListener("resize", applySidebarOffset);
  }, [isCollapsed]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const isOverlayOpen = isOverlayMode && !isCollapsed;

  const toggleLanguage = () => {
    const currentIndex = languages.indexOf(currentLang);
    const nextIndex = (currentIndex + 1) % languages.length;
    setCurrentLang(languages[nextIndex]);
  };

  return (
    <>
      {isOverlayOpen && (
        <button
          type="button"
          className={styles.backdrop}
          onClick={() => setIsCollapsed(true)}
          aria-label="Close sidebar"
        />
      )}
      <aside
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""} ${isOverlayOpen ? styles.overlayOpen : ""}`}
      >
        <div className={styles.scrollArea}>
          <div className={styles.topHeaderRow}>
            <span className={styles.groupLabel}>{!isCollapsed && "Casino"}</span>

            <button
              type="button"
              onClick={toggleSidebar}
              className={styles.toggleBtn}
            >
              <span
                className={
                  isCollapsed ? styles.cssHamburger : styles.cssArrowLeft
                }
              />
            </button>
          </div>

          <div className={styles.group}>
            <nav className={styles.nav}>
              {MAIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.link;
                return (
                  <Link
                    key={item.name}
                    href={item.link}
                    className={`${styles.item} ${isActive ? styles.active : ""}`}
                    title={isCollapsed ? item.name : ""}
                  >
                    <div className={styles.iconWrapper}>
                      <Icon size={NAV_ICON_SIZE} />
                    </div>
                    <span className={styles.text}>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className={styles.divider} />

          <div className={styles.group}>
            <span className={styles.groupLabel}>{!isCollapsed && "Support"}</span>
            <nav className={styles.nav}>
              {SUPPORT_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.link;
                return (
                  <Link
                    key={item.name}
                    href={item.link}
                    className={`${styles.item} ${isActive ? styles.active : ""}`}
                    title={isCollapsed ? item.name : ""}
                  >
                    <div className={styles.iconWrapper}>
                      <Icon size={NAV_ICON_SIZE} />
                    </div>
                    <span className={styles.text}>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className={styles.bottomArea}>
          {!isCollapsed && (
            <div className={styles.socials}>
              <a href="#" className={styles.socialIcon} aria-label="Telegram">
                <FaTelegramPlane size={20} />
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Discord">
                <FaDiscord size={20} />
              </a>
            </div>
          )}

          <button
            type="button"
            className={styles.langBtn}
            onClick={toggleLanguage}
            title={isCollapsed ? `Language: ${currentLang}` : ""}
          >
            <div className={styles.iconWrapper}>
              <MdLanguage size={NAV_ICON_SIZE} />
            </div>
            <span className={styles.text}>{currentLang}</span>
          </button>

          <div className={styles.securityBlock}>
            <div className={styles.securityItem} title="Provably Fair & Secure">
              <IoShieldCheckmarkOutline size={20} />
              <span className={styles.secText}>Secure</span>
            </div>
            <div
              className={styles.securityItem}
              title="18+ Responsible Gaming"
              aria-label="18+ Responsible Gaming"
            >
              <TbRating18Plus size={NAV_ICON_SIZE} aria-hidden />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SlideBar;

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IoHeartOutline,
  IoMenuOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import styles from "./Header.module.scss";
import BalanceDropdown from "../BalanceDropdown/BalanceDropdown";
import BuregMenu from "../BuregMenu/BuregMenu";
import NotificationsDropdown from "../NotificationsDropdown/NotificationsDropdown";
import { useAppSelector } from "@/shared/lib/redux/hooks";
import {
  HEADER_AVATAR_PX,
  HEADER_ICON_SIZE,
  isPlaceholderAvatar,
} from "@/shared/config/navigation";
import { useAuthModal } from "@/components/AuthModal/provider/AuthModalProvider";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openLogin, openSignup } = useAuthModal();
  const user = useAppSelector((store) => store.user.user);
  // const authToken = useAppSelector((store) => store.auth.token);
  const isAuthed = Boolean(user);
  const showRegisteredHeader = isAuthed;
  return (
    <>
      <header
        className={`${styles.header} ${showRegisteredHeader ? styles.headerRegistered : ""}`}
      >
        <div className={styles.header__wrapper}>
          {/* ЛЕВАЯ ЧАСТЬ: Бургер и Логотип */}
          <div className={styles["header__wrapper-logoImg"]}>
            <button
              type="button"
              className={styles["header__wrapper-burgerMenu"]}
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <IoMenuOutline
                size={HEADER_ICON_SIZE}
                className={styles.headerIcon}
              />
            </button>

            <Link href="/" className={styles.header__brandLink}>
              <Image
                src="/logoMain.svg"
                alt="WinWave"
                width={80}
                height={69}
                priority
                quality={100}
                className={styles["header__wrapper-logoIcon"]}
              />
              <span className={styles["header__wrapper-logoName"]}>
                WinWave
              </span>
            </Link>
          </div>

          {/* ЦЕНТРАЛЬНАЯ ЧАСТЬ: Баланс и Депозит (отображается только для авторизованных) */}
          {showRegisteredHeader && (
            <div className={styles.header__walletRow}>
              <BalanceDropdown />
              <Link
                href="/deposit"
                className={styles["header__wrapper-balanceup"]}
              >
                Deposit
              </Link>
            </div>
          )}

          {/* ПРАВАЯ ЧАСТЬ: Авторизация ИЛИ Иконки профиля */}
          <div className={styles["header__wrapper-buttonList"]}>
            {!showRegisteredHeader ? (
              <div className={styles["header__wrapper-authGuest"]}>
                <button
                  type="button"
                  className={styles["header__wrapper-authLogin"]}
                  onClick={openLogin}
                >
                  Log in
                </button>
                <button
                  type="button"
                  className={styles["header__wrapper-authRegister"]}
                  onClick={openSignup}
                >
                  Sign up
                </button>
              </div>
            ) : (
              <div className={styles["header__wrapper-headerMenu"]}>
                <Link
                  href="/favourites"
                  className={styles.headerIconLink}
                  aria-label="Favourites"
                >
                  <IoHeartOutline
                    size={HEADER_ICON_SIZE}
                    className={styles.headerIcon}
                  />
                </Link>

                <NotificationsDropdown />

                <Link
                  href="/account"
                  className={styles.headerAvatarLink}
                  aria-label="Account"
                >
                  {user?.avatar && !isPlaceholderAvatar(user.avatar) ? (
                    <Image
                      src={user.avatar}
                      alt="Profile"
                      width={HEADER_AVATAR_PX}
                      height={HEADER_AVATAR_PX}
                      priority
                      className={styles.headerAvatarImg}
                    />
                  ) : (
                    <IoPersonCircleOutline
                      size={HEADER_AVATAR_PX}
                      className={styles.headerProfileGlyph}
                    />
                  )}
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <BuregMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;

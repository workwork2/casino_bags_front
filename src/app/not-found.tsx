import Link from "next/link";
import { IoHomeOutline, IoPlanetOutline } from "react-icons/io5";
import { AppShell } from "@/components/AppShell/AppShell";
import styles from "./NotFound.module.scss";

export default function NotFound() {
  return (
    // <AppShell>
    <div className={styles.page}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.iconWrap} aria-hidden>
            {/* <IoPlanetOutline className={styles.heroIcon} /> */}
          </div>

          <h1 className={styles.title}>This page doesn&apos;t exist</h1>

          <p className={styles.description}>
            The link may be broken or the page was removed. Head back to the
            lobby and keep playing.
          </p>

          <Link href="/" className={`app-cta-primary ${styles.homeLink}`}>
            {/* <IoHomeOutline size={20} aria-hidden /> */}
            <span>Go home</span>
          </Link>
        </div>
      </div>
    </div>
    // </AppShell>
  );
}

// import React from "react";

// const NotFound = () => {
//   return <div>NotFound</div>;
// };

// export default NotFound;

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IoArrowBack,
  IoContractOutline,
  IoExpandOutline,
  IoGameControllerOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@/shared/lib/redux/hooks";
import {
  MOCK_GAME_URL,
  openGame,
  resetGame,
} from "@/entities/game/model/slice";
import { slotsData } from "@/data/slots";
import { liveGamesData } from "@/data/live-games";
import SlotsCarousel from "@/components/SlotsCarousel/SlotsCarousel";
import RecentWinnings from "@/components/RecentWinnings/RecentWinnings";
import { Loader } from "@/shared/ui";
import styles from "./GamePlayShell.module.scss";
import { walletsSelectors } from "@/entities/wallet/model/slice";

const DEMO_MODE = process.env.NEXT_PUBLIC_GAME_MOCK === "1";

function resolveGameTitle(gameKey: string): string {
  const bySlug =
    slotsData.find((g) => g.slug === gameKey) ??
    liveGamesData.find((g) => g.slug === gameKey);
  if (bySlug) return bySlug.title;
  const n = Number(gameKey);
  if (!Number.isNaN(n)) {
    const byId = slotsData.find((g) => g.id === n);
    if (byId) return byId.title;
  }
  return `Game ${gameKey}`;
}

export default function GamePlayShell() {
  const { id } = useParams();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { gameUrl } = useAppSelector((s) => s.game);
  const selectedWalletId = useAppSelector(walletsSelectors.selectedWalletId);

  const gameKey = useMemo(() => {
    const raw = id;
    return Array.isArray(raw) ? raw[0] : (raw ?? "");
  }, [id]);

  const title = useMemo(() => resolveGameTitle(gameKey), [gameKey]);

  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [iframeKey, setIframeKey] = useState(0);
  const [fs, setFs] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !selectedWalletId) return;
    let cancelled = false;
    setPhase("loading");
    dispatch(openGame({ id, walletId: selectedWalletId }))
      .unwrap()
      .then(() => {
        if (!cancelled) setPhase("ready");
      })
      .catch(() => {
        if (!cancelled) setPhase("error");
      });
    return () => {
      cancelled = true;
      dispatch(resetGame());
    };
  }, [id, selectedWalletId]);

  const isMock = gameUrl === MOCK_GAME_URL;

  const retry = useCallback(() => {
    if (!gameKey) return;
    setPhase("loading");
    dispatch(openGame({ id, walletId: selectedWalletId }))
      .unwrap()
      .then(() => setPhase("ready"))
      .catch(() => setPhase("error"));
  }, [dispatch, gameKey]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const reloadFrame = useCallback(() => {
    setIframeKey((k) => k + 1);
  }, []);

  const toggleFs = useCallback(async () => {
    const el = shellRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const sync = () => setFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  if (!gameKey) {
    return (
      <div className={styles.wrap}>
        <div className="container">
          <p className={styles.muted}>Invalid game link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className="container">
        <div className={styles.shell} ref={shellRef}>
          {phase === "loading" ? (
            <div className={styles.loaderSlot}>
              <Loader />
            </div>
          ) : phase === "error" ? (
            <div className={styles.errorBox}>
              <h2 className={styles.errorTitle}>Could not start the game</h2>
              <p className={styles.errorText}>
                Check your connection or try again. For layout preview without
                the API, set{" "}
                <span className={styles.mockCode}>NEXT_PUBLIC_GAME_MOCK=1</span>{" "}
                in <span className={styles.mockCode}>.env.local</span> and
                restart the dev server.
              </p>
              <button
                type="button"
                className="app-cta-secondary"
                onClick={retry}
              >
                Try again
              </button>
              <button
                type="button"
                className="app-cta-primary"
                onClick={goBack}
              >
                Back to lobby
              </button>
            </div>
          ) : phase === "ready" && !gameUrl ? (
            <div className={styles.errorBox}>
              <h2 className={styles.errorTitle}>No game URL</h2>
              <p className={styles.errorText}>
                The server responded but did not return a launch URL. Try again
                or contact support.
              </p>
              <button
                type="button"
                className="app-cta-secondary"
                onClick={retry}
              >
                Try again
              </button>
              <button
                type="button"
                className="app-cta-primary"
                onClick={goBack}
              >
                Back to lobby
              </button>
            </div>
          ) : (
            <>
              <header className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={goBack}
                    aria-label="Back"
                  >
                    <IoArrowBack size={22} />
                  </button>
                  <h1 className={styles.gameTitle}>{title}</h1>
                  {DEMO_MODE ? (
                    <span className={styles.demoBadge}>Demo</span>
                  ) : null}
                </div>
                <div className={styles.toolbarActions}>
                  {!isMock ? (
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={reloadFrame}
                      aria-label="Reload game"
                    >
                      <IoRefreshOutline size={22} />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={toggleFs}
                    aria-label={fs ? "Exit fullscreen" : "Fullscreen"}
                  >
                    {fs ? (
                      <IoContractOutline size={22} />
                    ) : (
                      <IoExpandOutline size={22} />
                    )}
                  </button>
                </div>
              </header>

              <div className={styles.frameWrap}>
                <iframe
                  key={iframeKey}
                  className={styles.iframe}
                  src={gameUrl ?? undefined}
                  title={title}
                  allow="fullscreen; autoplay; payment"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="container">
        <SlotsCarousel />
      </div>
      <div className="container">
        <RecentWinnings />
      </div>
    </div>
  );
}

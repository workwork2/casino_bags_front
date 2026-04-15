"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IoAdd,
  IoBarChartOutline,
  IoCheckmarkCircle,
  IoCopyOutline,
  IoGridOutline,
  IoLogOutOutline,
  IoPencil,
  IoPeopleOutline,
  IoPersonOutline,
  IoReceiptOutline,
  IoRibbonOutline,
  IoSettingsOutline,
  IoShieldCheckmarkOutline,
  IoTimeOutline,
  IoWalletOutline,
} from "react-icons/io5";
import WalletNavigation from "@/components/WalletNavigation/WalletNavigation";
import { WalletPageLayout } from "@/shared/ui";
import ExitModal from "@/components/ExitModal/ExitModal";
import AvatarSelectModal from "@/components/AvatarSelectModal/AvatarSelectModal";

import styles from "./page.module.scss";
import { useAppDispatch } from "@/shared/lib/redux/hooks";
import { logoutUser } from "@/entities/user/model/api/logout";
import { useRouter } from "next/navigation";
import { api } from "@/shared/lib/api/axios";

import {
  PROFILE_HERO_AVATAR_PX,
  isPlaceholderAvatar,
} from "@/shared/config/navigation";

const ICON = 18;

const formatUsd = (value: number | undefined | null) => {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
};

function unwrapDashboardPayload(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (b.success === false) return null;
  const inner = b.data;
  if (inner && typeof inner === "object") {
    const d = inner as Record<string, unknown>;
    if (d.user && typeof d.user === "object")
      return d as Record<string, unknown>;
  }
  if (b.user && typeof b.user === "object") return b as Record<string, unknown>;
  return null;
}

function unwrapAffiliateLinkPayload(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (b.success === false) return null;
  const inner = b.data;
  if (inner && typeof inner === "object") {
    const d = inner as Record<string, unknown>;
    const link = d.link;
    if (typeof link === "string" && link.trim()) return link.trim();
  }
  const top = b.link;
  if (typeof top === "string" && top.trim()) return top.trim();
  return null;
}

export default function ProfileDashboardPage() {
  const router = useRouter();
  const appDispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<Record<
    string,
    unknown
  > | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("");
  const [currentAvatar, setCurrentAvatar] = useState("/lc.svg");
  const [copied, setCopied] = useState(false);

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [origin, setOrigin] = useState("");
  const [generatedReferralLink, setGeneratedReferralLink] = useState<
    string | null
  >(null);
  const [referralGenLoading, setReferralGenLoading] = useState(false);
  const [referralGenError, setReferralGenError] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(typeof window !== "undefined" ? window.location.origin : "");
  }, []);

  /** Прямая ссылка с бэкенда (если есть — показываем сразу) */
  const affiliateLinkFromApi = useMemo(() => {
    const aff = profileData?.affiliate as Record<string, unknown> | undefined;
    const direct =
      typeof aff?.link === "string" ? aff.link.trim() : "";
    return direct || "";
  }, [profileData]);

  const finalReferralLink =
    affiliateLinkFromApi || (generatedReferralLink ?? "");

  const handleGenerateReferralLink = async () => {
    if (!origin) return;
    setReferralGenLoading(true);
    setReferralGenError(null);
    try {
      try {
        const body = await api.post<unknown>("/profile/affiliate/link", {});
        const fromApi = unwrapAffiliateLinkPayload(body);
        if (fromApi) {
          setGeneratedReferralLink(fromApi);
          return;
        }
      } catch {
        /* пробуем собрать локально */
      }
      const aff = profileData?.affiliate as Record<string, unknown> | undefined;
      const codeRaw =
        typeof aff?.code === "string"
          ? aff.code
          : typeof aff?.refCode === "string"
            ? aff.refCode
            : typeof aff?.referralCode === "string"
              ? aff.referralCode
              : "";
      const code = String(codeRaw).trim();
      if (code) {
        setGeneratedReferralLink(
          `${origin}/?ref=${encodeURIComponent(code)}`,
        );
        return;
      }
      const slug =
        (typeof userName === "string" && userName.trim()) ||
        `ref-${Math.random().toString(36).slice(2, 11)}`;
      setGeneratedReferralLink(
        `${origin}/?ref=${encodeURIComponent(slug)}`,
      );
    } catch {
      setReferralGenError("Could not generate link. Try again.");
    } finally {
      setReferralGenLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const body = await api.get<unknown>("/profile/dashboard");
      const payload = unwrapDashboardPayload(body);
      if (!payload) {
        setProfileData(null);
        return;
      }
      setProfileData(payload);
      const user = payload.user as Record<string, unknown> | undefined;
      setUserName(typeof user?.username === "string" ? user.username : "");
      setCurrentAvatar(
        typeof user?.avatar === "string" && user.avatar
          ? user.avatar
          : "/lc.svg",
      );
    } catch (error) {
      console.error("Failed to load profile data", error);
      setProfileData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    const text = finalReferralLink;
    if (!text) return;
    void navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleFinalExit = async () => {
    await appDispatch(logoutUser());
    router.push("/");
  };

  const handleSaveAvatar = async (newAvatarUrl: string) => {
    setCurrentAvatar(newAvatarUrl);
    setIsAvatarModalOpen(false);
    try {
      await api.post("/profile/avatar", { avatarUrl: newAvatarUrl });
    } catch (error) {
      console.error("Failed to save avatar", error);
    }
  };

  const affiliate = profileData?.affiliate as
    | Record<string, unknown>
    | undefined;
  const stats = profileData?.stats as Record<string, unknown> | undefined;
  const user = profileData?.user as Record<string, unknown> | undefined;
  const security = profileData?.security as Record<string, unknown> | undefined;
  const preferences = profileData?.preferences as
    | Record<string, unknown>
    | undefined;

  const accountEmail =
    String(security?.email ?? user?.email ?? "").trim() || "—";
  const lastLoginLabel = String(security?.lastLoginLabel ?? "—");
  const twoFactorOn = Boolean(security?.twoFactorEnabled);
  const kycLevel = String(security?.kycLevel ?? "—");
  const prefLocale = String(preferences?.locale ?? "—");
  const prefOdds = String(preferences?.oddsFormat ?? "—");
  const prefTz = String(preferences?.timezone ?? "—");

  const totalReferred =
    typeof affiliate?.totalReferred === "number"
      ? affiliate.totalReferred
      : Number(affiliate?.totalReferred) || 0;
  const totalEarnedUsd =
    typeof affiliate?.totalEarnedUsd === "number"
      ? affiliate.totalEarnedUsd
      : Number(affiliate?.totalEarnedUsd) || 0;

  return (
    <>
      <WalletPageLayout
        title="My account"
        subtitle="Profile & wallet."
        titleIcon={<IoRibbonOutline size={32} aria-hidden />}
        navSlot={<WalletNavigation />}
      >
        <div className={styles.accountContent}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <IoTimeOutline
                size={28}
                className={styles.loadingIcon}
                aria-hidden
              />
              <p>Loading profile…</p>
            </div>
          ) : (
            <>
              <section className={styles.profileHero}>
                <div className={styles.heroLeft}>
                  <div className={styles.avatarBox}>
                    <div className={styles.avatarWrap}>
                      <div className={styles.avatarCircle}>
                        {isPlaceholderAvatar(currentAvatar) ? (
                          <IoPersonOutline
                            size={52}
                            className={styles.accountProfileGlyph}
                            aria-hidden
                          />
                        ) : (
                          <Image
                            src={currentAvatar}
                            alt=""
                            width={PROFILE_HERO_AVATAR_PX}
                            height={PROFILE_HERO_AVATAR_PX}
                            sizes={`${PROFILE_HERO_AVATAR_PX}px`}
                            quality={100}
                            unoptimized
                            className={styles.avatarImg}
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        className={styles.addBtn}
                        onClick={() => setIsAvatarModalOpen(true)}
                        aria-label="Change avatar"
                      >
                        <IoAdd size={16} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.userDetails}>
                    <div className={styles.nameRow}>
                      {isEditing ? (
                        <input
                          className={styles.nameInput}
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          onBlur={() => setIsEditing(false)}
                          autoFocus
                          aria-label="Username"
                        />
                      ) : (
                        <h2 className={styles.displayName}>
                          {userName || "Player"}
                        </h2>
                      )}
                      <button
                        type="button"
                        className={styles.editBtn}
                        onClick={() => setIsEditing(!isEditing)}
                        aria-label={isEditing ? "Done" : "Edit name"}
                      >
                        <IoPencil size={ICON} />
                      </button>
                    </div>
                    {accountEmail !== "—" ? (
                      <p className={styles.heroEmail}>{accountEmail}</p>
                    ) : null}
                    <p className={styles.userStatus}>
                      <span className={styles.onlineDot} aria-hidden />
                      <span>
                        {typeof user?.memberSince === "string"
                          ? `Since ${user.memberSince}`
                          : "Active"}
                      </span>
                      {kycLevel !== "—" ? (
                        <span className={styles.heroMetaPill}>{kycLevel}</span>
                      ) : null}
                    </p>
                  </div>
                </div>

                <div className={styles.heroRight}>
                  <button
                    type="button"
                    className={styles.logoutBtn}
                    title="Sign out"
                    onClick={() => setIsExitModalOpen(true)}
                  >
                    <IoLogOutOutline size={20} aria-hidden />
                    <span>Log out</span>
                  </button>
                </div>
              </section>

              <div className={styles.equalGrid}>
                <div className={styles.panelCard}>
                  <div className={styles.panelHeader}>
                    <IoShieldCheckmarkOutline size={ICON} aria-hidden />
                    <h2 className={styles.panelTitle}>Security & account</h2>
                  </div>
                  <div className={styles.panelBody}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Email</span>
                      <span className={styles.detailValue}>{accountEmail}</span>
                    </div>
                    <Link
                      href="/settings"
                      className={styles.panelSettingsLink}
                    >
                      Settings → email & login
                    </Link>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Last sign-in</span>
                      <span className={styles.detailValue}>
                        {lastLoginLabel}
                      </span>
                    </div>
                    <div className={styles.twoFactorPanel}>
                      <div className={styles.twoFactorPanelHeader}>
                        <span className={styles.twoFactorTitle}>2FA</span>
                        <span
                          className={
                            twoFactorOn
                              ? styles.statusBadgeOn
                              : styles.statusBadgeOff
                          }
                        >
                          {twoFactorOn ? "On" : "Off"}
                        </span>
                      </div>
                      <Link
                        href="/settings"
                        className={styles.twoFactorSettingsLink}
                      >
                        <IoSettingsOutline size={16} aria-hidden />
                        Manage in Settings
                      </Link>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Verification</span>
                      <span className={styles.detailValue}>{kycLevel}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.panelCard}>
                  <div className={styles.panelHeader}>
                    <IoPeopleOutline size={ICON} aria-hidden />
                    <h2 className={styles.panelTitle}>Referral program</h2>
                  </div>
                  <div className={styles.panelBody}>
                    <div className={styles.statsMainGrid}>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Friends joined</span>
                        <span className={styles.statValue}>{totalReferred}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Your earnings</span>
                        <span className={`${styles.statValue} ${styles.blue}`}>
                          {formatUsd(totalEarnedUsd)}
                        </span>
                      </div>
                      {finalReferralLink ? (
                        <div
                          className={`${styles.statItem} ${styles.statItemSpan}`}
                        >
                          <span className={styles.statLabel}>Referral link</span>
                          <div className={styles.linkInline}>
                            <input
                              readOnly
                              value={finalReferralLink}
                              className={styles.refInput}
                              aria-label="Referral link"
                              onFocus={(e) => e.currentTarget.select()}
                              onClick={(e) => e.currentTarget.select()}
                            />
                            <button
                              type="button"
                              className={`app-cta-primary ${styles.copyBtn}`}
                              onClick={handleCopyLink}
                            >
                              {copied ? (
                                <IoCheckmarkCircle size={ICON} aria-hidden />
                              ) : (
                                <IoCopyOutline size={ICON} aria-hidden />
                              )}
                              <span>{copied ? "Copied" : "Copy"}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`${styles.statItem} ${styles.statItemSpan}`}
                        >
                          <span className={styles.statLabel}>Your link</span>
                          <button
                            type="button"
                            className={`app-cta-secondary ${styles.referralGenBtn}`}
                            onClick={() => void handleGenerateReferralLink()}
                            disabled={!origin || referralGenLoading}
                          >
                            {referralGenLoading ? "…" : "Get link"}
                          </button>
                          {referralGenError ? (
                            <p className={styles.referralGenError} role="alert">
                              {referralGenError}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.panelCard}>
                  <div className={styles.panelHeader}>
                    <IoBarChartOutline size={ICON} aria-hidden />
                    <h2 className={styles.panelTitle}>Gaming activity</h2>
                  </div>
                  <div className={styles.panelBody}>
                    <div className={styles.statsMainGrid}>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Total win</span>
                        <span className={styles.statValue}>
                          {formatUsd(
                            typeof stats?.totalWinUsd === "number"
                              ? stats.totalWinUsd
                              : Number(stats?.totalWinUsd),
                          )}
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Total wagered</span>
                        <span className={styles.statValue}>
                          {formatUsd(
                            typeof stats?.totalWageredUsd === "number"
                              ? stats.totalWageredUsd
                              : Number(stats?.totalWageredUsd),
                          )}
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Favourite game</span>
                        <span className={styles.statValue}>
                          {typeof stats?.favoriteGame === "string" &&
                          stats.favoriteGame
                            ? stats.favoriteGame
                            : "—"}
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>
                          Biggest multiplier
                        </span>
                        <span className={`${styles.statValue} ${styles.green}`}>
                          {(() => {
                            const m =
                              typeof stats?.maxMultiplier === "number"
                                ? stats.maxMultiplier
                                : Number(stats?.maxMultiplier);
                            return Number.isFinite(m) && m > 0 ? `x${m}` : "—";
                          })()}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`app-cta-secondary ${styles.historyBtn}`}
                      onClick={() => router.push("/account/history")}
                    >
                      View full history
                    </button>
                  </div>
                </div>

                <div className={styles.panelCard}>
                  <div className={styles.panelHeader}>
                    <IoGridOutline size={ICON} aria-hidden />
                    <h2 className={styles.panelTitle}>
                      Preferences & shortcuts
                    </h2>
                  </div>
                  <div className={styles.panelBody}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Language</span>
                      <span className={styles.detailValue}>{prefLocale}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Odds format</span>
                      <span className={styles.detailValue}>{prefOdds}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Timezone</span>
                      <span className={styles.detailValue}>{prefTz}</span>
                    </div>
                    <div className={styles.quickLinks}>
                      <button
                        type="button"
                        className={`app-cta-secondary ${styles.quickLink}`}
                        onClick={() => router.push("/deposit")}
                      >
                        <IoWalletOutline size={18} aria-hidden />
                        Deposit
                      </button>
                      <button
                        type="button"
                        className={`app-cta-secondary ${styles.quickLink}`}
                        onClick={() => router.push("/account/withdraw")}
                      >
                        <IoWalletOutline size={18} aria-hidden />
                        Withdraw
                      </button>
                      <button
                        type="button"
                        className={`app-cta-secondary ${styles.quickLink}`}
                        onClick={() => router.push("/account/history")}
                      >
                        <IoReceiptOutline size={18} aria-hidden />
                        History
                      </button>
                      <button
                        type="button"
                        className={`app-cta-secondary ${styles.quickLink}`}
                        onClick={() => router.push("/settings")}
                      >
                        <IoSettingsOutline size={18} aria-hidden />
                        Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </WalletPageLayout>
      <ExitModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={handleFinalExit}
      />

      <AvatarSelectModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSave={handleSaveAvatar}
        initialAvatar={
          !isPlaceholderAvatar(currentAvatar) ? currentAvatar : undefined
        }
      />
    </>
  );
}

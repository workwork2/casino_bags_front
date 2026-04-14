"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  IoAdd,
  IoBarChartOutline,
  IoCheckmarkCircle,
  IoCopyOutline,
  IoGridOutline,
  IoLogOutOutline,
  IoPencil,
  IoPeopleOutline,
  IoPersonCircleOutline,
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
  ACCOUNT_AVATAR_PX,
  isPlaceholderAvatar,
} from "@/shared/config/navigation";

const ICON = 20;

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

  const referralLink =
    (profileData?.affiliate as Record<string, string> | undefined)?.link ?? "";

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
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
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
        subtitle="Referrals, balances, and gaming stats — same navigation as deposit and withdraw."
        titleIcon={<IoRibbonOutline size={40} aria-hidden />}
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
                    <div className={styles.avatarCircle}>
                      {isPlaceholderAvatar(currentAvatar) ? (
                        <IoPersonCircleOutline
                          size={ACCOUNT_AVATAR_PX}
                          className={styles.accountProfileGlyph}
                          aria-hidden
                        />
                      ) : (
                        <Image
                          src={currentAvatar}
                          alt=""
                          width={ACCOUNT_AVATAR_PX}
                          height={ACCOUNT_AVATAR_PX}
                          sizes={`${ACCOUNT_AVATAR_PX}px`}
                          quality={100}
                          unoptimized
                          className={styles.avatarImg}
                        />
                      )}
                      <button
                        type="button"
                        className={styles.addBtn}
                        onClick={() => setIsAvatarModalOpen(true)}
                        aria-label="Change avatar"
                      >
                        <IoAdd size={18} />
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
                    <p className={styles.userStatus}>
                      <span className={styles.onlineDot} aria-hidden />
                      <span>
                        Online
                        {typeof user?.memberSince === "string"
                          ? ` • Member since ${user.memberSince}`
                          : null}
                      </span>
                    </p>
                  </div>
                </div>

                <div className={styles.heroActions}>
                  <button
                    type="button"
                    className={styles.logoutBtn}
                    title="Sign out"
                    onClick={() => setIsExitModalOpen(true)}
                  >
                    <IoLogOutOutline size={ICON} aria-hidden />
                    <span>Logout</span>
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
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Last sign-in</span>
                      <span className={styles.detailValue}>
                        {lastLoginLabel}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>
                        Two-factor auth
                      </span>
                      <span className={styles.detailValue}>
                        {twoFactorOn ? "On" : "Off"}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Verification</span>
                      <span className={styles.detailValue}>{kycLevel}</span>
                    </div>
                    <p className={styles.panelHint}>
                      Enable 2FA in settings when available for extra
                      protection.
                    </p>
                  </div>
                </div>

                <div className={styles.panelCard}>
                  <div className={styles.panelHeader}>
                    <IoPeopleOutline size={ICON} aria-hidden />
                    <h2 className={styles.panelTitle}>Referral program</h2>
                  </div>
                  <div className={styles.panelBody}>
                    <div className={styles.referralHero}>
                      <div className={styles.referralBadge} aria-hidden>
                        <IoPeopleOutline size={28} />
                      </div>
                      <div className={styles.referralHeroText}>
                        <p className={styles.referralKicker}>Invite & earn</p>
                        <p className={styles.referralLead}>
                          One link for friends. You get a revenue share when
                          they play slots and live games — rates scale up to
                          about 15%.
                        </p>
                      </div>
                    </div>
                    <div className={styles.referralStatStrip}>
                      <div className={styles.referralStatTile}>
                        <span className={styles.referralStatValue}>
                          {totalReferred}
                        </span>
                        <span className={styles.referralStatLabel}>
                          Friends joined
                        </span>
                      </div>
                      <div className={styles.referralStatTile}>
                        <span
                          className={`${styles.referralStatValue} ${styles.blue}`}
                        >
                          {formatUsd(totalEarnedUsd)}
                        </span>
                        <span className={styles.referralStatLabel}>
                          Your earnings
                        </span>
                      </div>
                    </div>
                    <p className={styles.referralMicrocopy}>
                      Copy the link below and share it anywhere — socials,
                      messengers, or streams.
                    </p>
                    <div className={styles.linkContainer}>
                      <input
                        readOnly
                        value={referralLink}
                        className={styles.refInput}
                        aria-label="Referral link"
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

"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import PartnersNavigation from "@/components/PartnersNavigation/PartnersNavigation";
import ph from "../../partners-page-head.module.scss";
import {
  FaChartColumn,
  FaChartLine,
  FaCopy,
  FaKey,
  FaPlus,
  FaUsers,
} from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { HiChevronDown } from "react-icons/hi2";

import styles from "./page.module.scss";
import { CurrencyIcon } from "@/shared/ui/CurrencyIcon/CurrencyIcon";

type Campaign = {
  id: number;
  name: string;
  rate: string;
  commission: string;
  transitions: number;
  referrals: number;
  deposits: number;
};

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Viktor Z.",
    rate: "0.10",
    commission: "0.00000000",
    transitions: 0,
    referrals: 0,
    deposits: 0,
  },
  {
    id: 2,
    name: "Twitch_Promo_2025",
    rate: "0.15",
    commission: "0.00001240",
    transitions: 142,
    referrals: 12,
    deposits: 4,
  },
];

function referralUrl(campaignName: string) {
  const slug = encodeURIComponent(campaignName);
  return `https://yoursite.com/?c=${slug}`;
}

export default function PartnersReferralsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(1);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [modalError, setModalError] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const copyToClipboard = useCallback((text: string, campId: number) => {
    navigator.clipboard.writeText(text).then(() => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      setCopiedId(campId);
      copyTimerRef.current = setTimeout(() => setCopiedId(null), 2200);
    });
  }, []);

  const openModal = () => {
    setNewCampaignName("");
    setModalError("");
    setIsModalOpen(true);
  };

  const createCampaign = () => {
    const name = newCampaignName.trim();
    if (!name) {
      setModalError("Enter a campaign name so we can build a unique link.");
      return;
    }
    if (name.length < 2) {
      setModalError("Use at least 2 characters.");
      return;
    }
    const id = Date.now();
    setCampaigns((prev) => [
      ...prev,
      {
        id,
        name,
        rate: "—",
        commission: "0.00000000",
        transitions: 0,
        referrals: 0,
        deposits: 0,
      },
    ]);
    setExpandedCard(id);
    setIsModalOpen(false);
    setNewCampaignName("");
    setModalError("");
  };

  const toggleRow = (id: number) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.partnersReferrals}>
      <div className="container">
        <section className={styles.glassBox}>
          <div className={ph.partnersNavShell}>
            <PartnersNavigation />
          </div>
        </section>

        <section className={styles.glassBox}>
          <header className={ph.partnersPageHead}>
            <div className={ph.partnersPageHeadGrid}>
              <div className={ph.partnersIconSlot} aria-hidden>
                <FaChartColumn className={ph.partnersIconSvg} />
              </div>
              <div className={ph.partnersHeadBody}>
                <p className={ph.partnersKicker}>Affiliate program</p>
                <div className={ph.partnersTitleRow}>
                  <h1 className={ph.partnersH1}>Partner dashboard</h1>
                  <button
                    type="button"
                    className={styles.createBtn}
                    onClick={openModal}
                  >
                    <span className={styles.createBtnIcon}>
                      <FaPlus />
                    </span>
                    New campaign
                  </button>
                </div>
                <p className={ph.partnersLead}>
                  Numbers below are for the <strong>last 30 days</strong>. Each campaign has its own tracking link —
                  share it anywhere you promote the brand. Tap a row to open details, copy the link, or compare performance.
                  Withdraw your commission from <Link href="/account">Account</Link> when you reach the minimum.
                </p>
              </div>
            </div>
          </header>

          <div className={styles.helpStrip} role="region" aria-label="How this page works">
            <div className={styles.helpCard}>
              <span className={styles.helpNum} aria-hidden>
                1
              </span>
              <div className={styles.helpBody}>
                <strong className={styles.helpTitle}>Overview</strong>
                <p className={styles.helpText}>
                  Aggregated clicks, sign-ups, and available balance.
                </p>
              </div>
            </div>
            <div className={styles.helpCard}>
              <span className={styles.helpNum} aria-hidden>
                2
              </span>
              <div className={styles.helpBody}>
                <strong className={styles.helpTitle}>Campaigns</strong>
                <p className={styles.helpText}>
                  <span className={styles.helpDef}>
                    <strong>Rate</strong> — your deal tier for that link.
                  </span>{" "}
                  <span className={styles.helpDef}>
                    <strong>Commission</strong> — accrued in BTC.
                  </span>
                </p>
              </div>
            </div>
            <div className={styles.helpCard}>
              <span className={styles.helpNum} aria-hidden>
                3
              </span>
              <div className={styles.helpBody}>
                <strong className={styles.helpTitle}>Expand row</strong>
                <p className={styles.helpText}>
                  Period stats and your referral link to copy.
                </p>
              </div>
            </div>
          </div>

          <h2 className={styles.sectionHeading}>Overview (last 30 days)</h2>
          <div className={styles.cardGrid}>
            <article className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <span className={styles.statCardTitle}>Clicks</span>
                <span className={styles.statCardMeta}>Traffic</span>
              </div>
              <div className={styles.statCardMid}>
                <FaChartLine className={styles.statCardIcon} aria-hidden />
                <span className={styles.statCardValue}>1,402</span>
              </div>
              <p className={styles.statCardDesc}>
                Unique clicks through your tracking parameters (all campaigns combined).
              </p>
            </article>
            <article className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <span className={styles.statCardTitle}>Referrals</span>
                <span className={styles.statCardMeta}>Sign-ups</span>
              </div>
              <div className={styles.statCardMid}>
                <FaUsers className={styles.statCardIcon} aria-hidden />
                <span className={styles.statCardValue}>128</span>
              </div>
              <p className={styles.statCardDesc}>
                New registrations attributed to your partner account.
              </p>
            </article>
            <article className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <span className={styles.statCardTitle}>Available</span>
                <span className={styles.statCardMeta}>Balance</span>
              </div>
              <div className={styles.statCardMid}>
                <CurrencyIcon
                  symbol="BTC"
                  size={32}
                  variant="ui"
                  className={styles.statCardIcon}
                />
                <span className={styles.statCardValue}>0.00004512</span>
              </div>
              <p className={styles.statCardDesc}>
                Ready to withdraw in BTC. Other wallets: see{" "}
                <Link href="/account/withdraw">Withdraw</Link>.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.glassBox}>
          <h2 className={styles.sectionHeading}>Your campaigns</h2>
          <p className={styles.sectionIntro}>
            One line per tracking label. Create another campaign to split traffic (e.g. by country or creative). New
            links start at zero until traffic arrives.
          </p>

          <div className={styles.campaignTable}>
            <div className={styles.tableHeader}>
              <span>Campaign</span>
              <span className={styles.hideMobile}>Rate</span>
              <span className={styles.textRight}>Commission</span>
            </div>

            {campaigns.map((camp) => {
              const isOpen = expandedCard === camp.id;
              const url = referralUrl(camp.name);
              return (
                <div
                  key={camp.id}
                  className={`${styles.glassCard} ${isOpen ? styles.active : ""}`}
                >
                  <button
                    type="button"
                    className={styles.cardHeaderBtn}
                    onClick={() => toggleRow(camp.id)}
                    aria-expanded={isOpen}
                    aria-controls={`campaign-details-${camp.id}`}
                    id={`campaign-trigger-${camp.id}`}
                  >
                    <div className={styles.nameCol}>
                      <div className={styles.avatar} aria-hidden>
                        <span>{camp.name[0].toUpperCase()}</span>
                      </div>
                      <div className={styles.nameBlock}>
                        <span className={styles.nameText}>{camp.name}</span>
                        <span className={styles.rateMobile}>
                          Rate: <strong>{camp.rate}</strong>
                        </span>
                      </div>
                    </div>

                    <div className={`${styles.rateCol} ${styles.hideMobile}`}>
                      {camp.rate}
                    </div>

                    <div className={styles.commCol}>
                      <div className={styles.priceWrapper}>
                        <strong>{camp.commission}</strong>
                        <span className={styles.coinIcon}>
                          <CurrencyIcon symbol="BTC" size={18} variant="ui" />
                        </span>
                      </div>
                      <span
                        className={`${styles.arrow} ${isOpen ? styles.up : ""}`}
                        aria-hidden
                      >
                        <HiChevronDown />
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      className={styles.detailsContent}
                      id={`campaign-details-${camp.id}`}
                      role="region"
                      aria-labelledby={`campaign-trigger-${camp.id}`}
                    >
                      <div className={styles.detailsGrid}>
                        <div className={styles.detItem}>
                          <p>Clicks (period)</p>
                          <span>{camp.transitions}</span>
                        </div>
                        <div className={styles.detItem}>
                          <p>Referrals</p>
                          <span>{camp.referrals}</span>
                        </div>
                        <div className={styles.detItem}>
                          <p>Deposits</p>
                          <span>{camp.deposits}</span>
                        </div>
                      </div>
                      <div className={styles.linkSection}>
                        <label htmlFor={`link-${camp.id}`}>Referral link</label>
                        <p className={styles.linkHint}>
                          Anyone who registers via this URL is attributed to this campaign.
                        </p>
                        <div className={styles.linkRow}>
                          <input
                            id={`link-${camp.id}`}
                            readOnly
                            value={url}
                            onFocus={(e) => e.target.select()}
                          />
                          <button
                            type="button"
                            className={styles.copyBtn}
                            onClick={() => copyToClipboard(url, camp.id)}
                          >
                            <FaCopy aria-hidden />
                            {copiedId === camp.id ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className={styles.modalBox}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.headerTitle} id="modal-title">
                <span className={styles.headerIcon}>
                  <FaKey aria-hidden />
                </span>
                <span>New campaign</span>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                <IoClose aria-hidden />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.questionText}>
                Choose a short internal name (letters, numbers, underscore). We will generate a dedicated referral
                link and empty statistics for it.
              </p>

              <div className={styles.modalInputGroup}>
                <label className={styles.modalLabel} htmlFor="new-campaign-name">
                  Campaign name
                </label>
                <input
                  id="new-campaign-name"
                  type="text"
                  value={newCampaignName}
                  onChange={(e) => {
                    setNewCampaignName(e.target.value);
                    setModalError("");
                  }}
                  placeholder="e.g. Spring_LATAM_2025"
                  autoFocus
                />
                {modalError ? (
                  <p className={styles.modalError} role="alert">
                    {modalError}
                  </p>
                ) : null}
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={createCampaign}
                >
                  Create campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

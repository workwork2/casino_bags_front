"use client";

import Link from "next/link";
import PartnersNavigation from "@/components/PartnersNavigation/PartnersNavigation";
import {
  FaArrowRight,
  FaCircleCheck,
  FaClock,
  FaFileLines,
  FaPaperPlane,
  FaPlus,
} from "react-icons/fa6";
import ph from "../../partners-page-head.module.scss";
import styles from "./page.module.scss";

export default function PartnersCampaignPage() {
  return (
    <div className={styles.partnersCampaign}>
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
                <FaFileLines className={ph.partnersIconSvg} />
              </div>
              <div className={ph.partnersHeadBody}>
                <p className={ph.partnersKicker}>Affiliate program</p>
                <h1 className={ph.partnersH1}>Become a partner</h1>
                <p className={ph.partnersLead}>
                  Tell us about your traffic sources, regions, and experience. We review each application manually.
                  After approval, partner tools appear in your account: tracking links, stats, and payout requests.
                </p>
              </div>
            </div>
          </header>

          <div className={styles.layout}>
            <div className={styles.mainCol}>
              <form className={styles.partnerForm} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.formField}>
                  <label htmlFor="partner-email">
                    E-mail <span>*</span>
                  </label>
                  <input
                    id="partner-email"
                    type="email"
                    placeholder="partner@example.com"
                    autoComplete="email"
                  />
                </div>

                <div className={styles.gridRow}>
                  <div className={styles.formField}>
                    <label htmlFor="partner-name">
                      Name <span>*</span>
                    </label>
                    <input
                      id="partner-name"
                      type="text"
                      placeholder="First name"
                      autoComplete="given-name"
                    />
                  </div>
                  <div className={styles.formField}>
                    <label htmlFor="partner-last">
                      Last name <span>*</span>
                    </label>
                    <input
                      id="partner-last"
                      type="text"
                      placeholder="Last name"
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                <div className={styles.gridRow}>
                  <div className={styles.formField}>
                    <label htmlFor="partner-source">
                      Traffic source <span>*</span>
                    </label>
                    <select id="partner-source" defaultValue="">
                      <option value="" disabled>
                        Select traffic source
                      </option>
                      <option value="social">Social media</option>
                      <option value="site">Website / SEO</option>
                      <option value="ppc">Paid search / PPC</option>
                      <option value="stream">Streaming / video</option>
                      <option value="app">App / Telegram</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className={styles.formField}>
                    <label htmlFor="partner-url">
                      URL or channel <span>*</span>
                    </label>
                    <input
                      id="partner-url"
                      type="text"
                      placeholder="https:// or @channel"
                    />
                  </div>
                </div>

                <button type="button" className={styles.addSource}>
                  <span className={styles.addSourceIcon}>
                    <FaPlus />
                  </span>
                  Add another source
                </button>

                <div className={styles.formField}>
                  <label htmlFor="partner-regions">
                    Target regions <span>*</span>
                  </label>
                  <input
                    id="partner-regions"
                    type="text"
                    placeholder="e.g. EU, LATAM, Tier-1 English"
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="partner-why">
                    Why you would be a strong partner <span>*</span>
                  </label>
                  <textarea
                    id="partner-why"
                    placeholder="Audience size, monthly volumes, experience with casino or betting offers."
                    rows={5}
                  />
                </div>

                <p className={styles.formNote}>
                  By submitting, you confirm that your traffic follows our terms. We may e-mail you about RevShare, CPA,
                  or hybrid terms before your partner dashboard is switched on.
                </p>

                <button type="submit" className={styles.submitBtn}>
                  <FaPaperPlane aria-hidden />
                  Send application
                </button>
              </form>
            </div>

            <aside className={styles.sidebar} aria-label="Application process">
              <div className={styles.sideCard}>
                <h2 className={styles.sideTitle}>What happens next</h2>
                <ol className={styles.sideSteps}>
                  <li>
                    <FaCircleCheck className={styles.sideIcon} aria-hidden />
                    <span>
                      <strong>Review</strong> — we check your sources and regions (usually 1–3 business days).
                    </span>
                  </li>
                  <li>
                    <FaClock className={styles.sideIcon} aria-hidden />
                    <span>
                      <strong>Deal</strong> — if approved, a manager may confirm commission type and postback options.
                    </span>
                  </li>
                  <li>
                    <FaArrowRight className={styles.sideIcon} aria-hidden />
                    <span>
                      <strong>Dashboard</strong> — create campaigns and copy links under{" "}
                      <Link href="/partners/referrals">Referrals</Link>.
                    </span>
                  </li>
                </ol>
              </div>

              <div className={styles.sideCardMuted}>
                <p className={styles.sideMutedTitle}>Already approved?</p>
                <p className={styles.sideMutedText}>
                  Skip this form and open your tracking dashboard to create links and view earnings.
                </p>
                <Link href="/partners/referrals" className={styles.sideLink}>
                  Go to Referrals
                </Link>
              </div>

              <div className={styles.sideCardMuted}>
                <p className={styles.sideMutedTitle}>Questions</p>
                <p className={styles.sideMutedText}>
                  Commission models, payouts, and traffic rules are summarized on the FAQ page.
                </p>
                <Link href="/partners/faq" className={styles.sideLink}>
                  Partner FAQ
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}

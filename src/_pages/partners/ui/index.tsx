"use client";

import { useState } from "react";
import Link from "next/link";
import PartnersNavigation from "@/components/PartnersNavigation/PartnersNavigation";
import ph from "../partners-page-head.module.scss";
import styles from "./page.module.scss";
import {
  FaGlobe,
  FaCreditCard,
  FaLanguage,
  FaClipboardList,
  FaLink,
  FaCoins,
  FaBolt,
  FaChartLine,
  FaInfinity,
  FaSliders,
  FaHeadset,
  FaBriefcase,
  FaHandshake,
  FaGaugeHigh,
  FaUserShield,
} from "react-icons/fa6";
import { HiPlus } from "react-icons/hi2";
import { IoRocketOutline } from "react-icons/io5";
import { CurrencyIcon } from "@/shared/ui/CurrencyIcon/CurrencyIcon";

function PartnerCryptoFiatIcon({ className }: { className?: string }) {
  return <CurrencyIcon symbol="BTC" size={22} className={className} variant="ui" />;
}

const faqItems = [
  {
    question: "How does the affiliate program work?",
    answer:
      "You receive unique tracking links and optional promo codes. When players register and play through your traffic, " +
      "commissions are calculated automatically from net gaming revenue or CPA — depending on the model you agree with your manager. " +
      "All stats update in near real time in the partner dashboard (available in your account after approval).",
  },
  {
    question: "Who can join?",
    answer:
      "Website owners, SEO and PPC teams, streamers, communities, mobile app publishers, and social traffic — " +
      "any source that complies with our terms. We review each application to protect the brand and your long-term earnings.",
  },
  {
    question: "How do I apply and get access?",
    answer:
      "Submit the campaign form on this site. After approval you can log in, open Account → Partners (or the partner section in your profile), " +
      "create campaigns, copy links, and request creatives or postback URLs from support.",
  },
  {
    question: "What makes this program competitive?",
    answer:
      "Transparent reporting, flexible RevShare / CPA / hybrid deals, fast crypto and fiat payouts where available, " +
      "lifetime attribution for qualifying players, and a retention-focused product mix — slots, live casino, and regular promotions that help your players stay active.",
  },
];

const benefits: {
  title: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    title: "Fast payouts",
    desc: "Request withdrawals on schedule; crypto options where supported. Less waiting, clearer cash flow planning.",
    Icon: FaBolt,
  },
  {
    title: "Strong player value",
    desc: "Competitive bonuses and a deep game catalogue help you convert and retain traffic you send.",
    Icon: FaChartLine,
  },
  {
    title: "Crypto & fiat",
    desc: "Players can use major cryptocurrencies and traditional methods — you earn on real-money activity.",
    Icon: PartnerCryptoFiatIcon,
  },
  {
    title: "No artificial caps",
    desc: "Earn on qualifying player activity according to your deal — talk to us about hybrid or VIP tiers at volume.",
    Icon: FaInfinity,
  },
  {
    title: "Tailored deals",
    desc: "RevShare, CPA, or hybrid structures for streamers, media buyers, and communities — aligned with your traffic type.",
    Icon: FaSliders,
  },
  {
    title: "Partner support 24/7",
    desc: "Multilingual assistance for tracking, creatives, and account questions so you can scale with confidence.",
    Icon: FaHeadset,
  },
];

const stats = [
  {
    headTitle: "Global audience",
    meta: "Players",
    value: "24.9M+",
    desc: "Reach users in many regions — ideal for SEO, paid media, and influencer funnels.",
    Icon: FaGlobe,
  },
  {
    headTitle: "Payments",
    meta: "Methods",
    value: "33+",
    desc: "Broad cashier coverage helps deposits succeed and keeps your referred players active.",
    Icon: FaCreditCard,
  },
  {
    headTitle: "Localization",
    meta: "Languages",
    value: "16",
    desc: "Localized experience improves conversion on landing pages and in-product journeys.",
    Icon: FaLanguage,
  },
];

const steps = [
  {
    step: "Step 1",
    title: "Apply & get verified",
    body: "Send your traffic details. After approval, partner tools appear in your account.",
    Icon: FaClipboardList,
  },
  {
    step: "Step 2",
    title: "Create links & assets",
    body: "Generate tracking links, use banners or API feeds, and align creatives with your audience.",
    Icon: FaLink,
  },
  {
    step: "Step 3",
    title: "Earn & withdraw",
    body: "Track clicks, sign-ups, and revenue. Withdraw commissions according to your deal and schedule.",
    Icon: FaCoins,
  },
];

const PartnersReviewPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.partnersReview}>
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
                <FaHandshake className={ph.partnersIconSvg} />
              </div>
              <div className={ph.partnersHeadBody}>
                <p className={ph.partnersKicker}>Affiliate program</p>
                <h1 className={ph.partnersH1}>
                  Grow with us — earn from every qualifying player
                </h1>
                <p className={ph.partnersLead}>
                  Industry-grade tracking, flexible commission models, and a product mix built for retention:
                  slots, live casino, and promotions your audience expects from a top-tier operator.
                  After approval you manage everything from your account: links, stats, and payout requests.
                </p>
              </div>
            </div>
          </header>

          <div className={styles.heroPoints}>
            <div className={styles.heroPoint}>
              <FaGaugeHigh className={styles.heroPointIcon} aria-hidden />
              <div>
                <strong>Live dashboard</strong>
                <span>Clicks, registrations, deposits, and commissions in one place.</span>
              </div>
            </div>
            <div className={styles.heroPoint}>
              <FaUserShield className={styles.heroPointIcon} aria-hidden />
              <div>
                <strong>Fair attribution</strong>
                <span>Clear rules and manager support for high-volume partners.</span>
              </div>
            </div>
            <div className={styles.heroPoint}>
              <IoRocketOutline className={styles.heroPointIcon} aria-hidden />
              <div>
                <strong>Scale-ready</strong>
                <span>API, postbacks, and marketing kits on request.</span>
              </div>
            </div>
          </div>

          <h2 className={styles.sectionHeading}>Why partners choose our network</h2>
          <div className={styles.cardGrid}>
            {stats.map((item) => {
              const StatIcon = item.Icon;
              return (
              <article key={item.headTitle} className={styles.newsCard}>
                <div className={styles.newsCardHeader}>
                  <span className={styles.newsCardTitle}>{item.headTitle}</span>
                  <span className={styles.newsCardMeta}>{item.meta}</span>
                </div>
                <div className={styles.newsCardMid}>
                  <StatIcon className={styles.newsCardIcon} aria-hidden />
                  <span className={styles.newsCardValue}>{item.value}</span>
                </div>
                <div className={styles.newsCardBody}>
                  <p className={styles.newsCardDesc}>{item.desc}</p>
                </div>
              </article>
            );})}
          </div>
        </section>

        <section className={styles.glassBox}>
          <h2 className={styles.sectionHeading}>How it works</h2>
          <p className={styles.sectionIntro}>
            Three steps from application to recurring commissions. Your personal account becomes the control centre
            for campaigns and withdrawals once you are approved.
          </p>
          <div className={styles.cardGrid}>
            {steps.map((st) => {
              const StepIcon = st.Icon;
              return (
              <article key={st.step} className={styles.newsCard}>
                <div className={styles.newsCardHeader}>
                  <span className={styles.newsCardTitle}>{st.title}</span>
                  <span className={styles.newsCardMeta}>{st.step}</span>
                </div>
                <div className={styles.newsCardMid}>
                  <StepIcon className={styles.newsCardIcon} aria-hidden />
                </div>
                <div className={styles.newsCardBody}>
                  <p className={styles.newsCardDesc}>{st.body}</p>
                </div>
              </article>
            );})}
          </div>
        </section>

        <section className={styles.glassBox}>
          <div className={styles.ctaRow}>
            <div className={styles.ctaIconWrap} aria-hidden>
              <FaBriefcase />
            </div>
            <div className={styles.ctaText}>
              <h2 className={styles.ctaTitle}>High-volume traffic?</h2>
              <p className={styles.ctaDesc}>
                Streamers, media buyers, and communities with significant reach can negotiate custom RevShare, CPA,
                or hybrid terms. Tell us about your audience and GEOs — we will propose a deal that fits.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/account" className={styles.btnPrimary}>
                Open account
              </Link>
              <Link href="/partners/campaign" className={styles.btnGhost}>
                Apply as partner
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.glassBox}>
          <h2 className={styles.sectionHeading}>Program highlights</h2>
          <p className={styles.sectionIntro}>
            The same operational standards you would expect from leading iGaming brands — with tooling designed for affiliates.
          </p>
          <div className={styles.benefitsGrid}>
            {benefits.map(({ title, desc, Icon }) => (
              <article key={title} className={styles.benefitCard}>
                <div className={styles.benefitCardHeader}>
                  <span className={styles.benefitIconWrap}>
                    <Icon />
                  </span>
                  <h3 className={styles.benefitTitle}>{title}</h3>
                </div>
                <p className={styles.benefitDesc}>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.glassBox}>
          <h2 className={styles.sectionHeading}>FAQ</h2>
          <p className={styles.sectionIntro}>
            Quick answers about joining, account access, and how we support serious partners.
          </p>
          <div className={styles.faqList}>
            {faqItems.map((item, index) => (
              <div
                key={item.question}
                className={`${styles.faqItem} ${openIndex === index ? styles.faqOpen : ""}`}
              >
                <button
                  type="button"
                  className={styles.faqBtn}
                  onClick={() => toggleFAQ(index)}
                >
                  <span className={styles.faqQuestion}>{item.question}</span>
                  <span className={styles.faqToggle}>
                    <HiPlus />
                  </span>
                </button>
                <div className={styles.faqPanel}>
                  <div className={styles.faqPanelInner}>
                    <p className={styles.faqAnswer}>{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.applyBlock}>
            <p className={styles.applyHint}>
              Ready to start? Submit the partner form — after verification you will see partner tools in your account
              and can create your first campaign.
            </p>
            <div className={styles.applyActions}>
              <Link href="/partners/campaign" className={styles.btnPrimaryWide}>
                Apply for the partnership program
              </Link>
              <Link href="/partners/referrals" className={styles.btnLink}>
                Already approved — open referrals dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PartnersReviewPage;

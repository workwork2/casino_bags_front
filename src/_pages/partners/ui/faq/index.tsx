"use client";

import Link from "next/link";
import PartnersNavigation from "@/components/PartnersNavigation/PartnersNavigation";
import Accordion, { AccordionItemData } from "@/components/Accordion/Accordion";
import { FaHandshake } from "react-icons/fa6";

import ph from "../../partners-page-head.module.scss";
import styles from "./page.module.scss";

const faqData: AccordionItemData[] = [
  {
    id: 1,
    question: "HOW DOES THE PARTNER PROGRAM WORK?",
    answer:
      "You promote our casino using tracking links and optional promo codes. When players register and play, " +
      "commissions are calculated from qualifying activity (for example net gaming revenue or CPA — depending on your deal). " +
      "Reporting is available in your partner dashboard after approval, under the same account you use to play or withdraw.",
  },
  {
    id: 2,
    question: "WHAT COMMISSION MODELS ARE AVAILABLE?",
    answer:
      "We typically offer: " +
      "<ul>" +
      "<li><b>Revenue Share:</b> a percentage of net revenue from your players.</li>" +
      "<li><b>CPA:</b> a fixed payment when a referred user meets deposit / activity criteria.</li>" +
      "<li><b>Hybrid:</b> a combination tailored to your traffic type.</li>" +
      "</ul>" +
      "Exact percentages and caps are agreed with our team after we review your sources and regions.",
  },
  {
    id: 3,
    question: "WHEN AND HOW DO I GET PAID?",
    answer:
      "Payouts run on a fixed schedule (e.g. weekly or monthly — stated in your agreement). " +
      "Minimum amounts and methods match the options in your wallet: crypto and fiat where supported. " +
      "Keep your profile and payment details up to date in <b>Settings</b> to avoid delays.",
  },
  {
    id: 4,
    question: "WHAT MARKETING TOOLS DO YOU PROVIDE?",
    answer:
      "Partners get tracking links, deep links to games, banners in multiple sizes, landing pages, and on request: " +
      "postback URLs, API access, and creative refreshes aligned with seasonal campaigns on the site.",
  },
  {
    id: 5,
    question: "WHICH TRAFFIC SOURCES ARE NOT ALLOWED?",
    answer:
      "We welcome SEO, PPC where permitted, streaming, and social traffic that follows local laws. Prohibited: " +
      "<ul>" +
      "<li>Spam or unsolicited messaging.</li>" +
      "<li>Brand bidding on our trademarks without approval.</li>" +
      "<li>Misleading creatives or incentivized fraud.</li>" +
      "</ul>" +
      "Violations can void commissions and close the partner account.",
  },
];

export default function PartnersFaqPage() {
  return (
    <div className={styles.partnersFaq}>
      <div className="container">
        <section className={styles.glassBox}>
          <div className={ph.partnersNavShell}>
            <PartnersNavigation />
          </div>
        </section>

        <div className={styles.glassPanel}>
          <header className={ph.partnersPageHead}>
            <div className={ph.partnersPageHeadGrid}>
              <div className={ph.partnersIconSlot} aria-hidden>
                <FaHandshake className={ph.partnersIconSvg} />
              </div>
              <div className={ph.partnersHeadBody}>
                <h1 className={ph.partnersH1}>Partner FAQ</h1>
                <p className={ph.partnersLead}>
                  Models, payouts, creatives, and compliance — aligned with the same glass layout as{" "}
                  <strong>News</strong> and <strong>FAQ</strong> elsewhere on the site.
                </p>
              </div>
            </div>
          </header>

          <div className={styles.accordionWrapper}>
            <Accordion items={faqData} variant="faq" />
          </div>

          <p className={styles.footerHint}>
            Did not find an answer? Contact support from your account or complete the partner application on the{" "}
            <Link href="/partners/campaign">Campaign</Link> page — a manager will reply with next steps.
          </p>
        </div>
      </div>
    </div>
  );
}

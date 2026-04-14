"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./PromoCard.module.scss";

import { FaGoogle, FaXTwitter, FaFacebookF } from "react-icons/fa6";
import { RiCoupon3Line } from "react-icons/ri";

interface PromoCardProps {
  onSubmit?: (code: string) => void;
  className?: string;
}

export const PromoCard: React.FC<PromoCardProps> = ({ onSubmit, className }) => {
  const [promoCode, setPromoCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(promoCode);
  };

  return (
    <div className={`${styles.card} ${className || ""}`}>
      {/* ВЕРХНЯЯ ЧАСТЬ (Прижата к верху) */}
      <div className={styles.topContent}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <div className={styles.iconWrapper}>
              <RiCoupon3Line size={20} color="#a78bfa" />
            </div>
            <h2 className={styles.title}>Есть промокод?</h2>
          </div>

          <div className={styles.socials}>
            <Link href="/auth/google" className={styles.socialLink}>
              <FaGoogle size={14} />
            </Link>
            <Link href="/auth/twitter" className={styles.socialLink}>
              <FaXTwitter size={14} />
            </Link>
            <Link href="/auth/facebook" className={styles.socialLink}>
              <FaFacebookF size={14} />
            </Link>
          </div>
        </div>

        <p className={styles.subtitle}>
          Введите ваш секретный код ниже, чтобы получить фриспины, билеты на турниры или специальные награды.
        </p>
      </div>

      {/* НИЖНЯЯ ЧАСТЬ (Форма, прижата к низу) */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Введите код..."
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Применить
        </button>
      </form>
    </div>
  );
};
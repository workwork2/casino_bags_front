"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import styles from "./InfoModal.module.scss";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function InfoModal({
  isOpen,
  onClose,
  title = "Information",
  children,
}: InfoModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen, mounted]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-modal-title"
      >
        <div className={styles.header}>
          <span className={styles.title} id="info-modal-title">
            {title}
          </span>
          <button
            type="button"
            className="app-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <IoClose size={22} />
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
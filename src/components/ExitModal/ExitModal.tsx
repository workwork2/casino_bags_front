"use client";

import { IoClose, IoLogOutOutline } from "react-icons/io5";
import styles from "./ExitModal.module.scss";

interface ExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ExitModal({
  isOpen,
  onClose,
  onConfirm,
}: ExitModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.exitTitle}>
            <IoLogOutOutline size={22} aria-hidden />
            <span>Sign out</span>
          </div>
					<button
						type="button"
						className="app-modal-close"
						onClick={onClose}
						aria-label="Close"
					>
						<IoClose size={22} />
					</button>
        </div>

        <div className={styles.content}>
          <p className={styles.question}>Are you sure you want to sign out?</p>
        </div>

				<div className={styles.actions}>
					<button type="button" className={`app-cta-secondary ${styles.btnStay}`} onClick={onClose}>
						Stay
					</button>
					<button type="button" className={styles.btnExit} onClick={onConfirm}>
						Sign out
					</button>
				</div>
      </div>
    </div>
  );
}

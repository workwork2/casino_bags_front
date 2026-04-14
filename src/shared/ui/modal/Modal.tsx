'use client';

import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.scss';

type ModalProps = {
	opened: boolean;
	onClose: () => void;
	children: React.ReactNode;
	classNames?: {
		overlay?: string;
		inner?: string;
	};
};

export function Modal({ opened, onClose, children, classNames }: ModalProps) {
	const titleId = useId();
	const innerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!opened) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	}, [opened]);

	useEffect(() => {
		if (!opened) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [opened, onClose]);

	if (typeof document === 'undefined' || !opened) return null;

	return createPortal(
		<div
			className={`${styles.overlay} ${classNames?.overlay ?? ''}`}
			role='presentation'
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div
				ref={innerRef}
				className={`${styles.inner} ${classNames?.inner ?? ''}`}
				role='dialog'
				aria-modal='true'
				aria-labelledby={titleId}
				tabIndex={-1}
				onMouseDown={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}

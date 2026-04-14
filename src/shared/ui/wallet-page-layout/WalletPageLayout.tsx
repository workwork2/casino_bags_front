'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { IoChevronForward, IoHomeOutline } from 'react-icons/io5';
import styles from './WalletPageLayout.module.scss';

export type WalletCrumb = { label: string; href?: string };

type Props = {
	children: ReactNode;
	title: string;
	subtitle?: string;
	/** Иконка слева от заголовка (депозит / вывод и т.п.) */
	titleIcon?: ReactNode;
	/** Если передать массив — показываются крошки (по умолчанию скрыты) */
	crumbs?: WalletCrumb[];
	navSlot?: ReactNode;
};

export function WalletPageLayout({
	children,
	title,
	subtitle,
	titleIcon,
	crumbs,
	navSlot,
}: Props) {
	const showCrumbs = Boolean(crumbs?.length);

	return (
		<div className={styles.page}>
			<div className='container'>
				<div className={styles.shell}>
					<div className={styles.glow} aria-hidden />
					{showCrumbs ? (
						<nav className={styles.breadcrumbs} aria-label='Breadcrumb'>
							<Link href='/' className={styles.crumbLink}>
								<IoHomeOutline size={18} aria-hidden />
								<span>Home</span>
							</Link>
							{crumbs!.map((c, i) => (
								<span key={`${c.label}-${i}`} className={styles.crumbSegment}>
									<IoChevronForward className={styles.sep} size={14} aria-hidden />
									{c.href ? (
										<Link href={c.href} className={styles.crumbLink}>
											{c.label}
										</Link>
									) : (
										<span className={styles.crumbCurrent}>{c.label}</span>
									)}
								</span>
							))}
						</nav>
					) : null}
					<header className={styles.header}>
						<div className={styles.titleRow}>
							{titleIcon ? (
								<span className={styles.titleIconWrap} aria-hidden>
									{titleIcon}
								</span>
							) : null}
							<div className={styles.titleBlock}>
								<h1 className={styles.title}>{title}</h1>
								{subtitle ? (
									<p className={styles.subtitle}>{subtitle}</p>
								) : null}
							</div>
						</div>
					</header>
					{navSlot ? <div className={styles.navSlot}>{navSlot}</div> : null}
					{children}
				</div>
			</div>
		</div>
	);
}

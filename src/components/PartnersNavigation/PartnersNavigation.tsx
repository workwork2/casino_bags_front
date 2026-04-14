'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import styles from './PartnersNavigation.module.scss';

const navLinks = [
	{ name: 'Review', href: '/partners' },
	{ name: 'Campaign', href: '/partners/campaign' },
	{ name: 'Referrals', href: '/partners/referrals' },
	{ name: 'FAQ', href: '/partners/faq' },
];

function normalizePathname(path: string | null): string {
	if (!path) return '';
	const p = path.replace(/\/+$/, '') || '/';
	return p;
}

export default function PartnersNavigation() {
	const pathname = usePathname();
	const path = normalizePathname(pathname);

	const isActiveHref = (href: string) => {
		const h = normalizePathname(href);
		if (h === '/partners') {
			return path === '/partners';
		}
		return path === h;
	};

	return (
		<nav className={styles.navContainer} aria-label="Partners sections">
			{navLinks.map((link) => {
				const isActive = isActiveHref(link.href);
				return (
					<Link
						key={link.href}
						href={link.href}
						prefetch
						className={clsx(styles.navLink, isActive && styles.active)}
					>
						{link.name}
					</Link>
				);
			})}
		</nav>
	);
}

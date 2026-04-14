'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import styles from './WalletNavigation.module.scss';

const navLinks = [
    { name: 'My account', href: '/account' },
    { name: 'Deposit', href: '/deposit' },
    { name: 'Withdraw', href: '/account/withdraw' },
    { name: 'Transactions history', href: '/account/history' },
];

function normalizePathname(path: string | null): string {
    if (!path) return '';
    const p = path.replace(/\/+$/, '') || '/';
    return p;
}

export default function WalletNavigation() {
    const pathname = usePathname();
    const path = normalizePathname(pathname);

    const isActiveHref = (href: string) => {
        const h = normalizePathname(href);
        if (h === '/account') {
            return path === '/account';
        }
        return path === h;
    };

    return (
        <nav className={styles.navContainer} aria-label="Wallet and account">
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
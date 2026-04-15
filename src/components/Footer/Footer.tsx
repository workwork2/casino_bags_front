'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.scss';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useAppSelector } from '@/shared/lib/redux/hooks';
import { DEV_PREVIEW_REGISTERED_UI } from '@/shared/config/devFlags';
import { useAuthModal } from '@/components/AuthModal/provider/AuthModalProvider';

import { FaTwitter, FaFacebookF, FaTelegramPlane, FaHeadset } from 'react-icons/fa';
import { CurrencyIcon } from '@/shared/ui/CurrencyIcon/CurrencyIcon';

const CURRENCIES = [
    { id: 1, symbol: 'BTC' as const, size: '84,100$' },
    { id: 2, symbol: 'ETH' as const, size: '1,893$' },
    { id: 3, symbol: 'DOGE' as const, size: '94.45$' },
    { id: 4, symbol: 'LTC' as const, size: '0.23$' },
];

const NAV_MAIN = [
    { label: 'Home', href: '/' },
    { label: 'Bonuses', href: '/bonuses' },
    { label: 'Live games', href: '/live-casino' },
    { label: 'Slots', href: '/slots' },
];

const NAV_SECONDARY = [
    { label: 'Tournaments', href: '/tournaments' },
    { label: 'Loyalty', href: '/loyalty' },
    { label: 'News', href: '/news' },
    { label: 'Questions & Answers', href: '/faq' },
];

const SOCIALS = [
    { id: 1, href: '#', icon: FaTelegramPlane, alt: 'telegram' },
    { id: 2, href: '#', icon: FaTwitter, alt: 'twitter' },
    { id: 3, href: '#', icon: FaFacebookF, alt: 'facebook' },
];

const Footer = () => {
    const { openLogin, openSignup } = useAuthModal();
    const user = useAppSelector((s) => s.user.user);
    const token = useAppSelector((s) => s.auth.token);
    const isAuthed = Boolean(user || token);
    const showRegisteredUi = isAuthed || DEV_PREVIEW_REGISTERED_UI;

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footer__grid}>
                    
                    {/* КОЛОНКА 1: БРЕНД И ДЕЙСТВИЯ */}
                    <div className={styles.footer__colBrand}>
                        <div className={styles.footer__brandTop}>
                            <Link href='/' className={styles.footer__logo}>
                                <Image
                                    src="/footer__logo.svg"
                                    alt="Casino Logo"
                                    width={80}
                                    height={69}
                                    priority
                                    quality={100}
                                    className={styles.footer__logoImg}
                                />
                            </Link>

                            <div className={styles.footer__cryptoList}>
                                {CURRENCIES.map((item) => (
                                        <div key={item.id} className={styles.footer__cryptoItem}>
                                            <CurrencyIcon symbol={item.symbol} size={20} variant="ui" />
                                            <span>{item.size}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Кнопки (Support, Auth, Language) */}
                        <div className={styles.footer__actionsRow}>
                            <Link href="/support" className={styles.footer__supportBtn}>
                                <FaHeadset size={18} />
                                <span>24/7 Support</span>
                            </Link>
                            
                            {!showRegisteredUi && (
                                <div className={styles.footer__authRow}>
                                    <button
                                        type="button"
                                        className={styles.footer__authLogin}
                                        onClick={openLogin}
                                    >
                                        Log in
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.footer__authRegister}
                                        onClick={openSignup}
                                    >
                                        Sign up
                                    </button>
                                </div>
                            )}
                            
                            <div className={styles.footer__langWrap}>
                                <LanguageSelector />
                            </div>
                        </div>
                    </div>

                    {/* КОЛОНКА 2: НАВИГАЦИЯ 1 */}
                    <div className={styles.footer__colNav}>
                        <h4 className={styles.footer__navTitle}>CASINO</h4>
                        <ul className={styles.footer__navList}>
                            {NAV_MAIN.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* КОЛОНКА 3: НАВИГАЦИЯ 2 */}
                    <div className={styles.footer__colNav}>
                        <h4 className={styles.footer__navTitle}>INFORMATION</h4>
                        <ul className={styles.footer__navList}>
                            {NAV_SECONDARY.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* КОЛОНКА 4: СОЦСЕТИ */}
                    <div className={styles.footer__colSocials}>
                        <h4 className={styles.footer__navTitle}>COMMUNITY</h4>
                        <ul className={styles.footer__socialList}>
                            {SOCIALS.map((social) => {
                                const SocialIcon = social.icon;
                                return (
                                    <li key={social.id}>
                                        <Link href={social.href} aria-label={social.alt}>
                                            <SocialIcon size={20} />
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                </div>

                {/* НИЖНЯЯ ПАНЕЛЬ С 18+ — в том же контейнере, что и сетка */}
                <div className={styles.footer__bottom}>
                    <div className={styles.footer__bottomContent}>
                        <div className={styles.footer__legalInfo}>
                            <div className={styles.footer__ageLimit}>18+</div>
                            <p>© {new Date().getFullYear()} Casino Master. All rights reserved. Play Responsibly.</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './LanguageSelector.module.scss';

interface ILanguage {
    code: string;
    flag: string;
    label: string;
}

const languages: ILanguage[] = [
    { code: 'EN', flag: '🇬🇧', label: 'English' },
    { code: 'RU', flag: '🇷🇺', label: 'Russian' },
    { code: 'DE', flag: '🇩🇪', label: 'German' },
];

const LanguageSelector: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedLang, setSelectedLang] = useState<ILanguage>(languages[0]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleSelect = (lang: ILanguage) => {
        setSelectedLang(lang);
        setIsOpen(false);
    };

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button 
                className={`${styles.button} ${isOpen ? styles.active : ''}`} 
                onClick={toggleDropdown}
                type="button"
            >
                <div className={styles.contentLeft}>
                    <span className={styles.flagEmoji} aria-hidden="true">
                        {selectedLang.flag}
                    </span>
                    <span className={styles.langCode}>
                        {selectedLang.code}
                    </span>
                </div>

                {/* ЧИСТАЯ CSS-СТРЕЛКА. Белого квадрата больше не будет 100% */}
                <span className={`${styles.cssArrow} ${isOpen ? styles.rotated : ''}`}></span>
            </button>

            {isOpen && (
                <ul className={styles.dropdown}>
                    {languages.map((lang) => (
                        <li 
                            key={lang.code} 
                            className={styles.dropdownItem}
                            onClick={() => handleSelect(lang)}
                            aria-selected={selectedLang.code === lang.code}
                        >
                            <span className={styles.dropdownFlagEmoji} aria-hidden="true">
                                {lang.flag}
                            </span>
                            <span className={styles.dropdownLabel}>{lang.label}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LanguageSelector;
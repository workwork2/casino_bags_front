/**
 * Pill-навигация: ЛК (WalletNavigation), партнёры, Game Type.
 * Фактические значения — в :root как CSS-переменные (--ds-pill-nav-*).
 * Миксины: ds-pill-nav-container | ds-pill-nav-link | ds-pill-nav-chip | ds-pill-nav-filter-row | ds-page-back-link (helpers/mixins.scss).
 */
export const pillNavCssVars = {
	gap: '--ds-pill-nav-gap',
	gapTablet: '--ds-pill-nav-gap-tablet',
	gapTight: '--ds-pill-nav-gap-tight',
	fontSize: '--ds-pill-nav-font-size',
	fontSizeMd: '--ds-pill-nav-font-size-md',
	fontSizeTight: '--ds-pill-nav-font-size-tight',
	py: '--ds-pill-nav-py',
	px: '--ds-pill-nav-px',
	pyMd: '--ds-pill-nav-py-md',
	pxMd: '--ds-pill-nav-px-md',
	pyTight: '--ds-pill-nav-py-tight',
	pxTight: '--ds-pill-nav-px-tight',
	radius: '--ds-pill-nav-radius',
	color: '--ds-pill-nav-color',
	border: '--ds-pill-nav-border',
	bg: '--ds-pill-nav-bg',
	bgHover: '--ds-pill-nav-bg-hover',
	borderHover: '--ds-pill-nav-border-hover',
	activeBg: '--ds-pill-nav-active-bg',
	activeBorder: '--ds-pill-nav-active-border',
	activeShadow: '--ds-pill-nav-active-shadow',
	chipMinHeight: '--ds-pill-nav-chip-min-height',
	chipPx: '--ds-pill-nav-chip-px',
	chipFontSize: '--ds-pill-nav-chip-font-size',
	chipFontWeight: '--ds-pill-nav-chip-font-weight',
	chipListGap: '--ds-pill-nav-chip-list-gap',
} as const;

export type PillNavCssVar = (typeof pillNavCssVars)[keyof typeof pillNavCssVars];

/**
 * Глобальная типографика страниц (body + заголовки витрин/glass-блоков).
 * Реализация: `shared/styles/base/variables.scss` и `shared/styles/base/globals.scss`.
 */
export const typographyCssVars = {
	bodyFontSize: "--app-body-font-size",
	bodyLineHeight: "--app-body-line-height",
	bodyLetterSpacing: "--app-body-letter-spacing",
	headingPageSize: "--app-heading-page-size",
	headingPageSizeSm: "--app-heading-page-size-sm",
	headingPageLh: "--app-heading-page-lh",
	headingPageLs: "--app-heading-page-ls",
	glassHeadingSize: "--glass-heading-size",
	glassHeadingSizeSm: "--glass-heading-size-sm",
	textH1: "--ds-text-h1-size",
	textH1Lh: "--ds-text-h1-lh",
	textH2: "--ds-text-h2-size",
	textH2Lh: "--ds-text-h2-lh",
	textBodyMd: "--ds-text-body-md-size",
	textBodyMdLh: "--ds-text-body-md-lh",
} as const;

export type TypographyCssVar =
	(typeof typographyCssVars)[keyof typeof typographyCssVars];

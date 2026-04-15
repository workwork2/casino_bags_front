/**
 * Макет под фиксированный хедер: отступы для `main.mainContent` на всех страницах.
 * Значения по брейкпоинтам — в `shared/styles/base/variables.scss` (:root + @media).
 */

/** Ширина окна ≤ этого значения: скрытый сайдбар, мобильный хедер, нижняя навигация (px). */
export const APP_LAYOUT_MOBILE_MAX_PX = 950;

export const layoutCssVars = {
	headerHeight: "--app-header-height",
	mainBelowHeader: "--app-main-below-header",
	sidebarOffset: "--app-sidebar-offset",
	sidebarGap: "--app-sidebar-gap",
	containerPaddingX: "--container-padding-x",
} as const;

export type LayoutCssVar = (typeof layoutCssVars)[keyof typeof layoutCssVars];

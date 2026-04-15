/**
 * Режим QA: «залогиненный» пользователь + мок `/vip/info` (страница лояльности, CP, карточки).
 *
 * - **`development`**: по умолчанию **включён** (удобно проверять UI без бэка).
 * - **`production`**: по умолчанию **выключен**; включить только явно: `NEXT_PUBLIC_DEV_LOYALTY_PREVIEW=true`.
 * - Выключить в dev: `NEXT_PUBLIC_DEV_LOYALTY_PREVIEW=false`.
 */
export const DEV_LOYALTY_PREVIEW = (() => {
  const v = process.env.NEXT_PUBLIC_DEV_LOYALTY_PREVIEW;
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return process.env.NODE_ENV === "development";
})();

/**
 * Хедер/футер как у зарегистрированного — синхронно с `DEV_LOYALTY_PREVIEW`.
 */
export const DEV_PREVIEW_REGISTERED_UI = DEV_LOYALTY_PREVIEW;

/**
 * Когда `true` — депозит, вывод, ЛК (`/account/*`, `/deposit`) без редиректа на логин.
 *
 * По умолчанию: **вкл** в `development`, **выкл** в `production` (чтобы прод был защищён).
 * Принудительно: `NEXT_PUBLIC_BYPASS_WALLET_AUTH=true|false`
 */
export const BYPASS_WALLET_AUTH_FOR_DESIGN = (() => {
  const v = process.env.NEXT_PUBLIC_BYPASS_WALLET_AUTH;
  if (v === "false" || v === "0") return false;
  if (v === "true" || v === "1") return true;
  return process.env.NODE_ENV !== "production";
})();

/**
 * ВРЕМЕННО: хедер/футер ведут себя как для залогиненного пользователя.
 * Перед продакшеном установи `false`.
 */
export const DEV_PREVIEW_REGISTERED_UI = false;

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

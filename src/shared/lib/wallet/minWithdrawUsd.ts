import type { Currency } from '@/entities/wallet/api/walletApi';

/** Единый порог в USD для пополнения и вывода в интерфейсе кассы. */
export const MIN_CASHIER_USD = 25;

/** @deprecated используй MIN_CASHIER_USD */
export const MIN_WITHDRAW_USD = MIN_CASHIER_USD;

export function formatCryptoMinAmount(n: number): string {
	if (!Number.isFinite(n) || n <= 0) return '0';
	const s = n.toFixed(8).replace(/\.?0+$/, '');
	return s || '0';
}

/**
 * Минимум вывода в крипте: не ниже сети/API и не ниже MIN_CASHIER_USD по курсу.
 */
export function getEffectiveMinWithdrawalCrypto(currency: Currency): number {
	const price = parseFloat(currency.priceUsd || '0');
	const safePrice = !Number.isFinite(price) || price <= 0 ? 1 : price;
	const apiMin = parseFloat(currency.minWithdrawal || '0') || 0;
	const floorFromUsd = MIN_CASHIER_USD / safePrice;
	return Math.max(apiMin, floorFromUsd);
}

/**
 * Минимум депозита в крипте: не ниже API и не ниже MIN_CASHIER_USD по курсу.
 */
export function getEffectiveMinDepositCrypto(currency: Currency): number {
	const price = parseFloat(currency.priceUsd || '0');
	const safePrice = !Number.isFinite(price) || price <= 0 ? 1 : price;
	const apiMin = parseFloat(currency.minDeposit || '0') || 0;
	const floorFromUsd = MIN_CASHIER_USD / safePrice;
	return Math.max(apiMin, floorFromUsd);
}

export function cryptoToUsdAmount(
	cryptoAmount: number,
	currency: Currency,
): number {
	const price = parseFloat(currency.priceUsd || '0');
	const safePrice = !Number.isFinite(price) || price <= 0 ? 0 : price;
	return cryptoAmount * safePrice;
}

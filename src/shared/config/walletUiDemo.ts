import type { Currency } from '@/entities/wallet/api/walletApi';
import type { VirtualWallet } from '@/entities/wallet/model/slice';
import type { AppDispatch } from '@/shared/lib/redux/store';
import { currenciesActions } from '@/entities/currency/model/slice';
import { walletsActions } from '@/entities/wallet/model/slice';

/**
 * UI без бэкенда: мок-кошельки, депозит/вывод не ходят в API.
 * Отключить: в .env.local задать NEXT_PUBLIC_WALLET_UI_DEMO=0
 */
export const isWalletUiDemoMode =
	process.env.NEXT_PUBLIC_WALLET_UI_DEMO !== '0';

function c(
	p: Pick<Currency, 'id' | 'symbol' | 'name' | 'network'> &
		Partial<Currency>,
): Currency {
	return {
		id: p.id,
		symbol: p.symbol,
		name: p.name,
		network: p.network,
		priceUsd: p.priceUsd ?? '1',
		lastPriceUpdate: null,
		isActive: true,
		isDepositEnabled: true,
		isWithdrawalEnabled: true,
		icon: p.icon ?? null,
		decimals: p.decimals ?? 8,
		minDeposit: p.minDeposit ?? '0.00001',
		minWithdrawal: p.minWithdrawal ?? '0.00002',
		withdrawalFee: p.withdrawalFee ?? '0.00001',
		contractAddress: null,
		minConfirmations: p.minConfirmations ?? 3,
	};
}

export const WALLET_UI_DEMO_CURRENCIES: Currency[] = [
	c({
		id: 'demo-usdt',
		symbol: 'USDT',
		name: 'Tether USD',
		network: 'TRC20',
		priceUsd: '1',
		decimals: 2,
		minDeposit: '10',
		minWithdrawal: '10',
		withdrawalFee: '1',
	}),
	c({
		id: 'demo-btc',
		symbol: 'BTC',
		name: 'Bitcoin',
		network: 'BTC',
		priceUsd: '95000',
		minDeposit: '0.0001',
		minWithdrawal: '0.0002',
		withdrawalFee: '0.00005',
	}),
	c({
		id: 'demo-eth',
		symbol: 'ETH',
		name: 'Ethereum',
		network: 'ERC20',
		priceUsd: '3200',
		minDeposit: '0.001',
		minWithdrawal: '0.002',
		withdrawalFee: '0.001',
	}),
];

export const WALLET_UI_DEMO_WALLETS: VirtualWallet[] = [
	{
		id: 'demo-usdt',
		currencyId: 'demo-usdt',
		realBalance: '1250.50',
		lockedBalance: '0',
		balanceUsd: '1250.50',
	},
	{
		id: 'demo-btc',
		currencyId: 'demo-btc',
		realBalance: '0.04825000',
		lockedBalance: '0',
		balanceUsd: '4583.75',
	},
	{
		id: 'demo-eth',
		currencyId: 'demo-eth',
		realBalance: '2.34000000',
		lockedBalance: '0',
		balanceUsd: '7488.00',
	},
];

export function applyWalletUiDemo(dispatch: AppDispatch): void {
	dispatch(currenciesActions.upsertMany(WALLET_UI_DEMO_CURRENCIES));
	dispatch(walletsActions.upsertMany(WALLET_UI_DEMO_WALLETS));
	dispatch(walletsActions.setSelectedWallet(WALLET_UI_DEMO_WALLETS[0].id));
}

export function getDemoDepositAddress(symbol: string): string {
	const s = symbol.toUpperCase();
	if (s === 'BTC') {
		return 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
	}
	if (s === 'ETH' || s === 'USDT') {
		return '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0';
	}
	return 'DemoAddr1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
}

/** Профиль личного кабинета, если API недоступен в демо */
export const WALLET_UI_DEMO_PROFILE = {
	user: {
		username: 'Demo Player',
		avatar: '/lc.svg',
		memberSince: 'Jan 2024',
	},
	vip: {
		progressPercent: 35,
		currentLevel: 1,
		currentWagerUsd: 240,
		targetWagerUsd: 500,
	},
	affiliate: {
		link: 'https://winwave.example/?ref=demo-preview-7k2',
		totalReferred: 12,
		totalEarnedUsd: 184.52,
	},
	stats: {
		totalWinUsd: 4231.18,
		totalWageredUsd: 15890.45,
		favoriteGame: 'Sweet Bonanza',
		maxMultiplier: 1250,
	},
	security: {
		email: 'demo.player@example.com',
		lastLoginLabel: '2 hours ago',
		twoFactorEnabled: false,
		kycLevel: 'Standard',
	},
	preferences: {
		locale: 'EN',
		oddsFormat: 'Decimal',
		timezone: 'UTC',
	},
};

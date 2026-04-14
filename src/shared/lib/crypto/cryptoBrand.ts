/**
 * Официальные / каноничные цвета брендов криптовалют (Simple Icons + брендбуки).
 * Единый источник для хедера, кассы, футера, партнёров и т.д.
 */
export const CRYPTO_BRAND_COLORS: Record<string, string> = {
	BTC: '#F7931A',
	ETH: '#627EEA',
	USDT: '#26A17B',
	USDC: '#2775CA',
	BUSD: '#F0B90B',
	BNB: '#F3BA2F',
	DOGE: '#C2A633',
	LTC: '#345D9D',
	BCH: '#8DC351',
	BSV: '#EAB300',
	SOL: '#9945FF',
	XRP: '#00AAE4',
	ADA: '#0033AD',
	MATIC: '#8247E5',
	POL: '#8247E5',
	DOT: '#E6007A',
	AVAX: '#E84142',
	LINK: '#375BD2',
	ATOM: '#2E3148',
	XMR: '#FF6600',
	TON: '#0098EA',
	TRX: '#FF0013',
	SHIB: '#FFA409',
	UNI: '#FF007A',
	AAVE: '#B6509E',
	NEAR: '#00EC97',
	FTM: '#1969FF',
	CRO: '#002D74',
	CRV: '#40649F',
	SUSHI: '#FA52A0',
	APT: '#000000',
	ARB: '#28A0F0',
	OP: '#FF0420',
};

const FALLBACK_ICON = 'rgba(255, 255, 255, 0.55)';

export function getCryptoBrandColor(symbol: string): string {
	const k = (symbol || '').trim().toUpperCase();
	return CRYPTO_BRAND_COLORS[k] ?? FALLBACK_ICON;
}

import { api } from "@/shared/lib/api/axios";

export type Currency = {
  id: string;
  symbol: string;
  name: string;
  network: string;
  priceUsd: string;
  lastPriceUpdate: Date | null;
  isActive: boolean | null;
  isDepositEnabled: boolean | null;
  isWithdrawalEnabled: boolean | null;
  icon: string | null;
  decimals: number;
  minDeposit: string | null;
  minWithdrawal: string | null;
  withdrawalFee: string | null;
  contractAddress: string | null;
  minConfirmations: number | null;
};

// Кошелек с бэкенда прилетает с вложенной валютой
export type VirtualWalletResponse = {
  id: string; // Равен currencyId
  currencyId: string;
  realBalance: string; // Крипта
  lockedBalance: string; // Крипта в холде
  balanceUsd: string; // Фиатный эквивалент
  currency: Currency;
};

interface GetMyWalletsResponse {
  wallets: VirtualWalletResponse[];
  activeWalletId: string | null;
  totalBalanceUsd: string;
}

// === API ФУНКЦИИ ===
export const getMyWallets = async () => {
  try {
    const res = await api.get<GetMyWalletsResponse>("/wallet");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch wallets", err);
    return null;
  }
};

export const selectWallet = async (currencyId: string, walletId: string) => {
  const res = await api.post("/wallet/select-wallet", { currencyId, walletId });
  return res.data;
};

// Обмен (Swap) одной крипты на другую
export const swapCurrency = async (
  fromCurrencyId: string,
  toCurrencyId: string,
  amount: string, // Сумма в крипте, которую отдаем
) => {
  const res = await api.post("/wallet/swap", {
    fromCurrencyId,
    toCurrencyId,
    amount,
  });
  return res.data;
};

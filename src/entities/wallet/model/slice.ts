import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/shared/lib/redux/store";

// Нормализованный кошелек для Redux (без вложенного объекта currency)
export type VirtualWallet = {
  id: string;
  currencyId: string;
  realBalance: string;
  lockedBalance: string;
  balanceUsd: string;
};

const walletsAdapter = createEntityAdapter<VirtualWallet>();

const walletSlice = createSlice({
  name: "wallets",
  initialState: walletsAdapter.getInitialState<{
    selectedWalletId: string | null;
  }>({
    selectedWalletId: null,
  }),
  reducers: {
    upsertMany: walletsAdapter.upsertMany,
    setAll: walletsAdapter.setAll,

    setSelectedWallet(state, action: PayloadAction<string>) {
      state.selectedWalletId = action.payload;
    },

    // Для обновления баланса через WebSockets (если понадобится)
    applyBalancePatch(
      state,
      action: PayloadAction<{
        walletId: string;
        patch: Partial<
          Pick<VirtualWallet, "realBalance" | "lockedBalance" | "balanceUsd">
        >;
      }>,
    ) {
      const { walletId, patch } = action.payload;

      const wallet =
        state.entities[walletId] ||
        Object.values(state.entities).find((w) => w?.currencyId === walletId);

      // Если кошелек так и не найден в сторе - выходим
      if (!wallet) return;

      walletsAdapter.updateOne(state, {
        id: wallet.id, // Обязательно используем id найденного кошелька
        changes: patch,
      });
    },
  },
});

export const walletsActions = walletSlice.actions;

// Убедитесь, что в rootReducer этот слайс подключен как 'wallet' или 'wallets'
export const walletsSelectors = {
  ...walletsAdapter.getSelectors((state: RootState) => state.wallet),
  selectedWalletId: (state: RootState) => state.wallet.selectedWalletId,
  selectedWallet: (state: RootState) => {
    const id = state.wallet.selectedWalletId;
    return id ? state.wallet.entities[id] : null;
  },
};

export default walletSlice.reducer;

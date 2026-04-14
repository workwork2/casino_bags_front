import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/shared/lib/redux/store";

export interface BetItem {
  id: string | number;
  gameName: string;
  user: string;
  time: string;
  betAmount: number;
  betCurrencyIcon: string;
  coefficient: string;
  payout: number;
  payoutCurrencyIcon: string;
  status: "win" | "loss" | "pending";
}

interface BetsState {
  recentBets: BetItem[];
}

const initialState: BetsState = {
  recentBets: [],
};

const betsSlice = createSlice({
  name: "bets",
  initialState,
  reducers: {
    // Установка начальных данных с бэкенда
    setInitialBets: (state, action: PayloadAction<BetItem[]>) => {
      // Обрезаем до 8 (на случай, если бэк прислал больше)
      console.log(action.payload, "payload");
      state.recentBets = action.payload.data.slice(0, 8);
    },

    // Добавление ставки из WebSocket
    addSocketBet: (state, action: PayloadAction<BetItem>) => {
      const exists = state.recentBets.find((b) => b.id === action.payload.id);

      if (!exists) {
        state.recentBets.unshift(action.payload); // Добавляем в начало
        if (state.recentBets.length > 8) {
          state.recentBets.length = 8; // СТРОГИЙ ЛИМИТ В 8 СТАВОК
        }
      } else {
        const index = state.recentBets.findIndex(
          (b) => b.id === action.payload.id,
        );
        if (index !== -1) state.recentBets[index] = action.payload;
      }
    },

    // Обновление ставки
    updateBetStatus: (state, action: PayloadAction<BetItem>) => {
      const index = state.recentBets.findIndex(
        (b) => b.id === action.payload.id,
      );
      if (index !== -1) {
        state.recentBets[index] = action.payload;
      }
    },
  },
});

export const { setInitialBets, addSocketBet, updateBetStatus } =
  betsSlice.actions;
export const selectRecentBets = (state: RootState) => state.bets.recentBets;
export default betsSlice.reducer;

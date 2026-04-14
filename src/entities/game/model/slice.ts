import { api } from "@/shared/lib/api/axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

/** Set to "1" to skip /games/open and show the in-app demo player (layout preview). */
const GAME_MOCK = false;

export const MOCK_GAME_URL = "__MOCK__";

type initialStateType = {
  gameUrl: null | string;
  gameId: string | null;
};

const initialState: initialStateType = { gameUrl: null, gameId: null };

export const openGame = createAsyncThunk(
  "games/open",
  async ({ id, walletId }: { id: string; walletId: string }) => {
    return await api.post("/games/open", {
      id,
      walletId,
      demo: false,
    });
  },
);

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameUrl: (state, action: PayloadAction<string>) => {
      state.gameUrl = action.payload;
    },

    setGameId: (state, action: PayloadAction<string>) => {
      state.gameId = action.payload;
    },

    resetGame: () => initialState,
  },
  extraReducers(builder) {
    builder.addCase(openGame.fulfilled, (state, action) => {
      state.gameId = String(action.meta.arg);
      const p = action.payload as {
        data?: {
          data?: { content?: { game?: { url?: string } } };
          content?: { game?: { url?: string } };
        };
      };
      const root = p.data ?? {};
      const url =
        root.data?.content?.game?.url ?? root.content?.game?.url ?? null;
      state.gameUrl = url;
    });
  },
});

export const { setGameUrl, setGameId, resetGame } = gameSlice.actions;

export default gameSlice.reducer;

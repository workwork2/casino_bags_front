import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchVipInfoApi } from "../api/vip-api";

export const fetchVipData = createAsyncThunk(
  "vip/fetchVipData",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchVipInfoApi();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch VIP data",
      );
    }
  },
);

interface VipState {
  data: any | null; // В идеале типизировать интерфейсами бэкенда
  isLoading: boolean;
  error: string | null;
}

const initialState: VipState = {
  data: null,
  isLoading: true,
  error: null,
};

const vipSlice = createSlice({
  name: "vip",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVipData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVipData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchVipData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default vipSlice.reducer;

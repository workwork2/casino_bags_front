import { RootState } from "@/shared/lib/redux/store";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Currency } from "@/entities/wallet/api/walletApi";

const currenciesAdapter = createEntityAdapter<Currency>();

const currencySlice = createSlice({
  name: "currencies",
  initialState: currenciesAdapter.getInitialState(),
  reducers: {
    upsertMany: currenciesAdapter.upsertMany,
    updatePrice: currenciesAdapter.updateOne,
  },
});

export const currenciesActions = currencySlice.actions;

export const currenciesSelectors = currenciesAdapter.getSelectors(
  (state: RootState) => state.currencies,
);

export default currencySlice.reducer;

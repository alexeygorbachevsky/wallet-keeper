import { ActionReducerMapBuilder, EntityAdapter, EntityState } from "@reduxjs/toolkit";

import { Wallet } from "types/wallet";
import { loadWalletsFromStorage } from "utils/storage";

import { createAppAsyncThunk } from "../../../types";

interface LoadWalletsResult {
  wallets: Wallet[];
}

interface ExtraInitialState {
  loading: boolean;
  error: string | null;
}

export const loadWallets = createAppAsyncThunk<LoadWalletsResult, void>(
  "wallets/loadWallets",
  async (_, { rejectWithValue }) => {
    try {
      const wallets = await loadWalletsFromStorage();

      return { wallets };
    } catch {
      return rejectWithValue("Failed to load wallets");
    }
  }
);

export const loadWalletsReducer = (
  builder: ActionReducerMapBuilder<EntityState<Wallet, string> & ExtraInitialState>,
  walletsAdapter: EntityAdapter<Wallet, string>,
) => {
  builder
    .addCase(loadWallets.pending, state => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loadWallets.fulfilled, (state, action) => {
      walletsAdapter.setAll(state, action.payload.wallets);
      state.loading = false;
    })
    .addCase(loadWallets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to load wallets";
    });

  return builder;
}; 
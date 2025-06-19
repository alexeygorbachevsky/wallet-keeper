import { createSlice, PayloadAction, createEntityAdapter } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { Wallet } from "types/wallet";

import { saveWallets } from "utils/storage";

import type { RootState } from "../../types";

import { createWalletReducer } from "./thunks/create-wallet";
import { updateNetworkBalanceReducer } from "./thunks/update-network-balance";
import { loadWalletsReducer } from "./thunks/load-wallets";

interface ExtraInitialState {
  loading: boolean;
  error: string | null;
}

const walletsAdapter = createEntityAdapter<Wallet>({
  sortComparer: (a: Wallet, b: Wallet) => b.createdAt - a.createdAt,
});

const walletsSlice = createSlice({
  name: "wallets",
  initialState: walletsAdapter.getInitialState<ExtraInitialState>({
    loading: true,
    error: null,
  }),
  reducers: {
    clearError: state => {
      state.error = null;
    },
    removeWallet: (state, action: PayloadAction<string>) => {
      const walletId = action.payload;

      walletsAdapter.removeOne(state, walletId);

      try {
        const allWallets = state.ids.map(id => state.entities[id]) as Wallet[];
        saveWallets(allWallets);
      } catch {
        toast.error("Failed to save wallets");
      }
    }
  },
  extraReducers: builder => {
    loadWalletsReducer(builder, walletsAdapter);
    createWalletReducer(builder, walletsAdapter);
    updateNetworkBalanceReducer(builder);
  },
});

export const { clearError, removeWallet } = walletsSlice.actions;

export const {
  selectAll: selectAllWallets,
  selectById: selectWalletById,
  selectIds: selectWalletIds,
  selectEntities: selectWalletEntities,
  selectTotal: selectWalletsTotal,
} = walletsAdapter.getSelectors<RootState>(state => state.wallet);

export default walletsSlice.reducer;

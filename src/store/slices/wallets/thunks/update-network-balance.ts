import {
  ActionReducerMapBuilder,
  EntityState,
} from "@reduxjs/toolkit";

import { Wallet } from "types/wallet";

import { TESTNET_NETWORKS, MAINNET_NETWORKS } from "constants/networks";

import { NetworkNames, NetworkBalance } from "types/networks";

import { getBalance } from "utils/balance";

import { createAppAsyncThunk } from "../../../types";
import { selectWalletById } from "../walletsSlice";

interface UpdateNetworkBalanceResult {
  walletId: string;
  networkName: NetworkNames;
  balance: string;
  timestamp: number;
}

interface ExtraInitialState {
  loading: boolean;
  error: string | null;
}

export const updateNetworkBalance = createAppAsyncThunk<
  UpdateNetworkBalanceResult,
  { walletId: string; networkName: NetworkNames }
>(
  "wallets/updateNetworkBalance",
  async ({ walletId, networkName }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const wallet = selectWalletById(state, walletId);

      const allNetworks = [...MAINNET_NETWORKS, ...TESTNET_NETWORKS];
      const network = allNetworks.find(n => n.name === networkName)!;

      const balance = await getBalance(wallet.address, network);

      return {
        walletId,
        networkName,
        balance: balance.toString(),
        timestamp: Date.now(),
      };
    } catch {
      return rejectWithValue(`Error updating ${networkName} balance`);
    }
  }
);

export const updateNetworkBalanceReducer = (
  builder: ActionReducerMapBuilder<
    EntityState<Wallet, string> & ExtraInitialState
  >
) => {
  builder
    .addCase(updateNetworkBalance.pending, (state, action) => {
      const { walletId, networkName } = action.meta.arg;
      const wallet = state.entities[walletId];

      if (!wallet.networkBalances) {
        wallet.networkBalances = {};
      }

      wallet.networkBalances[networkName] = {
        network: networkName,
        balance: "0",
        loading: true,
      } as NetworkBalance;
    })
    .addCase(updateNetworkBalance.fulfilled, (state, action) => {
      const { walletId, networkName, balance } = action.payload;
      const wallet = state.entities[walletId];

      wallet.networkBalances![networkName] = {
        network: networkName,
        balance,
        loading: false,
      } as NetworkBalance;
    })
    .addCase(updateNetworkBalance.rejected, (state, action) => {
      const { walletId, networkName } = action.meta.arg;
      const wallet = state.entities[walletId];

      wallet.networkBalances![networkName] = {
        network: networkName,
        balance: "0",
        loading: false,
        error: "Error",
      } as NetworkBalance;
    });

  return builder;
};

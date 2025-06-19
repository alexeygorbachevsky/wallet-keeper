import { toast } from "react-toastify";
import {
  ActionReducerMapBuilder,
  EntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";

import { Wallet } from "types/wallet";
import { NetworkBalance, NetworkNames } from "types/networks";

import { TESTNET_NETWORKS, MAINNET_NETWORKS } from "constants/networks";

import { generateWallet, encryptPrivateKey } from "utils/crypto";
import { saveWallets } from "utils/storage";
import { sleep } from "utils/common";

import { createAppAsyncThunk } from "../../../types";

export interface GenerateWalletPayload {
  password: string;
  name?: string;
}

interface ExtraInitialState {
  loading: boolean;
  error: string | null;
}

export const createWallet = createAppAsyncThunk<
  Wallet,
  GenerateWalletPayload
>("wallets/generate", async (payload, { rejectWithValue }) => {
  try {
    const { name, password } = payload;

    const allNetworks = [...MAINNET_NETWORKS, ...TESTNET_NETWORKS];
    const initialNetworkBalances = allNetworks.reduce(
      (acc, network) => {
        acc[network.name] = {
          network: network.name,
          balance: "0",
          loading: false,
        };
        return acc;
      },
      {} as Record<NetworkNames, NetworkBalance>
    );

    await sleep();
    const { address, privateKey } = generateWallet();
    const encryptedJson = await encryptPrivateKey(privateKey, password);

    const newWallet: Wallet = {
      id: crypto.randomUUID(),
      name: name || `Wallet ${Date.now()}`,
      address,
      encryptedJson,
      createdAt: Date.now(),
      networkBalances: initialNetworkBalances,
    };

    return newWallet;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Error generating wallet"
    );
  }
});

export const createWalletReducer = (
  builder: ActionReducerMapBuilder<
    EntityState<Wallet, string> & ExtraInitialState
  >,
  walletsAdapter: EntityAdapter<Wallet, string>
) => {
  builder
    .addCase(createWallet.fulfilled, (state, action) => {
      toast.success("Wallet created successfully!");

      walletsAdapter.addOne(state, action.payload);

      const allWallets = state.ids.map(
        (id: string) => state.entities[id]
      ) as Wallet[];
      saveWallets(allWallets);
    })
    .addCase(createWallet.rejected, (_state, action) => {
      toast.error(action.error.message || "Error generating wallet")
    });

  return builder;
};

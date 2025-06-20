import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";

import { Wallet } from "types/wallet";
import { NetworkNames } from "types/networks";

import walletsReducer from "store/slices/wallets/walletsSlice";
import { updateNetworkBalance } from "store/slices/wallets/thunks/update-network-balance";
import modalReducer from "store/slices/modal/modalSlice";

import { getBalance } from "utils/balance";

vi.mock("utils/balance", () => ({
  getBalance: vi.fn(),
}));

describe.concurrent("updateNetworkBalance thunk", () => {
  const mockWallet: Wallet = {
    id: "1",
    name: "Test Wallet",
    address: "0x1234567890123456789012345678901234567890",
    encryptedJson: "encrypted-data",
    createdAt: Date.now(),
    networkBalances: {
      [NetworkNames.ethereum]: {
        network: NetworkNames.ethereum,
        balance: "0",
        loading: false,
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update network balance successfully", async () => {
    const store = configureStore({
      reducer: {
        wallet: walletsReducer,
        modal: modalReducer,
      },
    });

    store.dispatch({
      type: "wallets/generate/fulfilled",
      payload: mockWallet,
    });

    const mockBalance = new BigNumber("1000000000000000000");
    vi.mocked(getBalance).mockResolvedValue(mockBalance);

    const result = await store.dispatch(
      updateNetworkBalance({
        walletId: "1",
        networkName: NetworkNames.ethereum,
      })
    );

    expect(getBalance).toHaveBeenCalledWith(
      mockWallet.address,
      expect.any(Object)
    );

    expect(result.payload).toEqual({
      walletId: "1",
      networkName: NetworkNames.ethereum,
      balance: mockBalance.toString(),
      timestamp: expect.any(Number),
    });

    const updatedWallet = store.getState().wallet.entities["1"];
    expect(
      updatedWallet?.networkBalances?.[NetworkNames.ethereum]?.balance
    ).toBe(mockBalance.toString());
    expect(
      updatedWallet?.networkBalances?.[NetworkNames.ethereum]?.loading
    ).toBe(false);
  });

  it("should handle balance update error", async () => {
    const store = configureStore({
      reducer: {
        wallet: walletsReducer,
        modal: modalReducer,
      },
    });

    store.dispatch({
      type: "wallets/generate/fulfilled",
      payload: mockWallet,
    });

    vi.mocked(getBalance).mockRejectedValue(new Error("Network error"));

    await store.dispatch(
      updateNetworkBalance({
        walletId: "1",
        networkName: NetworkNames.bnbChain,
      })
    );

    expect(getBalance).toHaveBeenCalled();

    const updatedWallet = store.getState().wallet.entities["1"];
    expect(
      updatedWallet?.networkBalances?.[NetworkNames.bnbChain]?.balance
    ).toBe("0");
    expect(
      updatedWallet?.networkBalances?.[NetworkNames.bnbChain]?.loading
    ).toBe(false);
    expect(updatedWallet?.networkBalances?.[NetworkNames.bnbChain]?.error).toBe(
      "Error"
    );
  });

  it("should handle non-existent wallet", async () => {
    const store = configureStore({
      reducer: {
        wallet: walletsReducer,
        modal: modalReducer,
      },
    });

    const result = await store.dispatch(
      updateNetworkBalance({
        walletId: "non-existent",
        networkName: NetworkNames.ethereum,
      })
    );

    expect(result.meta.requestStatus).toBe("rejected");
  });

  it("should initialize networkBalances if not exists", async () => {
    const store = configureStore({
      reducer: {
        wallet: walletsReducer,
        modal: modalReducer,
      },
    });

    const walletWithoutBalances: Wallet = {
      ...mockWallet,
      id: "2",
      networkBalances: {},
    };

    store.dispatch({
      type: "wallets/generate/fulfilled",
      payload: walletWithoutBalances,
    });

    const mockBalance = new BigNumber("500000000000000000");
    vi.mocked(getBalance).mockResolvedValue(mockBalance);

    await store.dispatch(
      updateNetworkBalance({
        walletId: "2",
        networkName: NetworkNames.ethSepolia,
      })
    );

    const updatedWallet = store.getState().wallet.entities["2"];
    expect(
      updatedWallet?.networkBalances?.[NetworkNames.ethSepolia]
    ).toBeDefined();
    expect(
      updatedWallet?.networkBalances?.[NetworkNames.ethSepolia]?.balance
    ).toBe(mockBalance.toString());
  });
});

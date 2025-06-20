import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

import { Wallet } from "types/wallet";
import { NetworkNames } from "types/networks";

import walletsReducer from "store/slices/wallets/walletsSlice";
import { loadWallets } from "store/slices/wallets/thunks/load-wallets";
import modalReducer from "store/slices/modal/modalSlice";

import { loadWalletsFromStorage } from "utils/storage";

vi.mock("utils/storage", () => ({
  loadWalletsFromStorage: vi.fn(),
}));

describe.concurrent("loadWallets thunk", () => {
  const mockWallets: Wallet[] = [
    {
      id: "1",
      name: "Test Wallet 1",
      address: "0x1234567890123456789012345678901234567890",
      encryptedJson: "encrypted-data-1",
      createdAt: Date.now(),
      networkBalances: {
        [NetworkNames.ethereum]: {
          network: NetworkNames.ethereum,
          balance: "1000000000000000000",
          loading: false,
        },
      },
    },
    {
      id: "2",
      name: "Test Wallet 2",
      address: "0xabcdef1234567890abcdef1234567890abcdef12",
      encryptedJson: "encrypted-data-2",
      createdAt: Date.now() + 1000,
      networkBalances: {},
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should load wallets successfully", async () => {
    const store = configureStore({
      reducer: {
        wallet: walletsReducer,
        modal: modalReducer,
      },
    });

    vi.mocked(loadWalletsFromStorage).mockReturnValue(mockWallets);

    const result = await store.dispatch(loadWallets());

    expect(loadWalletsFromStorage).toHaveBeenCalled();

    expect(result.payload).toEqual({ wallets: mockWallets });

    expect(store.getState().wallet.loading).toBe(false);
    expect(store.getState().wallet.error).toBeNull();
  });

  it("should handle storage error", async () => {
    const store = configureStore({
      reducer: {
        wallet: walletsReducer,
        modal: modalReducer,
      },
    });

    vi.mocked(loadWalletsFromStorage).mockImplementation(() => {
      throw new Error("Storage error");
    });

    const result = await store.dispatch(loadWallets());

    expect(result.meta.requestStatus).toBe("rejected");
    expect(loadWalletsFromStorage).toHaveBeenCalled();

    expect(store.getState().wallet.loading).toBe(false);
    expect(store.getState().wallet.error).toBe("Failed to load wallets");
  });

  it("should handle empty wallets array", async () => {
    const store = configureStore({
      reducer: {
        wallet: walletsReducer,
        modal: modalReducer,
      },
    });

    vi.mocked(loadWalletsFromStorage).mockReturnValue([]);

    const result = await store.dispatch(loadWallets());

    expect(loadWalletsFromStorage).toHaveBeenCalled();

    expect(result.payload).toEqual({ wallets: [] });

    expect(store.getState().wallet.loading).toBe(false);
    expect(store.getState().wallet.error).toBeNull();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { Wallet } from "types/wallet";
import { NetworkNames } from "types/networks";

import walletsReducer, {
  clearError,
  removeWallet,
  selectWalletsTotal,
} from "store/slices/wallets/walletsSlice";
import modalReducer from "store/slices/modal/modalSlice";

vi.mock("utils/storage", () => ({
  saveWallets: vi.fn(),
  loadWallets: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

import { saveWallets } from "utils/storage";

const createTestStore = () => {
  return configureStore({
    reducer: {
      wallet: walletsReducer,
      modal: modalReducer,
    },
  });
};

describe.concurrent("walletsSlice", () => {
  const mockWallet: Wallet = {
    id: "1",
    name: "Test Wallet",
    address: "0x1234567890123456789012345678901234567890",
    encryptedJson: "encrypted-data",
    createdAt: Date.now(),
    networkBalances: {
      [NetworkNames.ethereum]: {
        network: NetworkNames.ethereum,
        balance: "1000000000000000000",
        loading: false,
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(saveWallets).mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe.concurrent("reducers", () => {
    it("should handle clearError", () => {
      const store = createTestStore();

      store.dispatch({
        type: "wallets/loadWallets/rejected",
        error: { message: "Test error" },
      });

      const state = store.getState();
      expect(state.wallet.error).toBe("Test error");

      store.dispatch(clearError());

      const newState = store.getState();
      expect(newState.wallet.error).toBeNull();
    });

    it("should handle removeWallet", () => {
      const store = createTestStore();

      store.dispatch({
        type: "wallets/generate/fulfilled",
        payload: mockWallet,
      });

      store.dispatch({
        type: "wallets/generate/fulfilled",
        payload: {
          ...mockWallet,
          id: "2",
          name: "Test Wallet 2",
        },
      });

      const state = store.getState();
      expect(selectWalletsTotal(state)).toBe(2);

      vi.mocked(saveWallets).mockClear();

      store.dispatch(removeWallet("1"));

      expect(saveWallets).toHaveBeenCalledWith([
        expect.objectContaining({ id: "2" }),
      ]);
    });

    it("should handle removeWallet error", () => {
      const store = createTestStore();

      store.dispatch({
        type: "wallets/generate/fulfilled",
        payload: mockWallet,
      });

      vi.mocked(saveWallets).mockImplementation(() => {
        throw new Error("Storage error");
      });

      store.dispatch(removeWallet("1"));

      expect(toast.error).toHaveBeenCalledWith("Failed to save wallets");
    });
  });
});

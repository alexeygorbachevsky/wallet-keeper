import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

import { Wallet } from "types/wallet";

import walletsReducer from "store/slices/wallets/walletsSlice";
import { createWallet } from "store/slices/wallets/thunks/create-wallet";
import modalReducer from "store/slices/modal/modalSlice";

import { generateWallet, encryptPrivateKey } from "utils/crypto";
import { saveWallets } from "utils/storage";
import { sleep } from "utils/common";

vi.mock("utils/crypto", () => ({
  generateWallet: vi.fn(),
  encryptPrivateKey: vi.fn(),
}));

vi.mock("utils/storage", () => ({
  saveWallets: vi.fn(),
}));

vi.mock("utils/common", () => ({
  sleep: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe.concurrent("createWallet thunk", () => {
  const mockWalletData = {
    address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    privateKey:
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  };

  const mockEncryptedJson = "encrypted-wallet-data";

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(generateWallet).mockReturnValue(mockWalletData);
    vi.mocked(encryptPrivateKey).mockResolvedValue(mockEncryptedJson);
    vi.mocked(sleep).mockResolvedValue(undefined);
    vi.mocked(saveWallets).mockImplementation(() => {});

    Object.defineProperty(global, "crypto", {
      value: {
        randomUUID: vi.fn(() => "test-wallet-id"),
      },
      writable: true,
    });
  });

  it("should create wallet successfully with custom name", async () => {
    const store = configureStore({
      reducer: {
        wallet: walletsReducer,
        modal: modalReducer,
      },
    });

    const payload = {
      password: "test-password-123",
      name: "My Custom Wallet",
    };

    const result = await store.dispatch(createWallet(payload));

    const createdWallet = result.payload as Wallet;

    expect(createdWallet).toMatchObject({
      id: "test-wallet-id",
      name: "My Custom Wallet",
      address: mockWalletData.address,
      encryptedJson: mockEncryptedJson,
      createdAt: expect.any(Number),
    });

    expect(createdWallet.networkBalances).toBeDefined();

    if (createdWallet.networkBalances) {
      Object.values(createdWallet.networkBalances).forEach(balance => {
        expect(balance).toMatchObject({
          network: expect.any(String),
          balance: "0",
          loading: false,
        });
      });
    }

    expect(sleep).toHaveBeenCalledOnce();
    expect(generateWallet).toHaveBeenCalledOnce();
    expect(encryptPrivateKey).toHaveBeenCalledWith(
      mockWalletData.privateKey,
      payload.password
    );
    expect(saveWallets).toHaveBeenCalledWith([
      expect.objectContaining({
        id: "test-wallet-id",
        name: "My Custom Wallet",
      }),
    ]);

    const state = store.getState().wallet;
    expect(state.entities).toHaveProperty("test-wallet-id");
    expect(state.entities["test-wallet-id"]).toMatchObject({
      id: "test-wallet-id",
      name: "My Custom Wallet",
      address: mockWalletData.address,
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

import { saveWallets, loadWalletsFromStorage } from "utils/storage";

describe.concurrent("storage utils", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should handle empty wallets array", () => {
    saveWallets([]);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "walletKeeper/wallets",
      JSON.stringify([])
    );
  });

  describe.concurrent("loadWalletsFromStorage", () => {

    it.concurrent(
      "should return empty array when no data in localStorage",
      () => {
        vi.mocked(localStorage.getItem).mockReturnValue(null);

        const result = loadWalletsFromStorage();

        expect(result).toEqual([]);
        expect(localStorage.getItem).toHaveBeenCalledWith(
          "walletKeeper/wallets"
        );
      }
    );

    it("should load wallets from localStorage and add empty networkBalances", () => {
      const storedData = [
        {
          id: "1",
          name: "Test Wallet",
          address: "0x1234567890123456789012345678901234567890",
          encryptedJson: "encrypted-data",
          createdAt: 1234567890,
        },
      ];

      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify(storedData)
      );

      const result = loadWalletsFromStorage();

      expect(result).toEqual([
        {
          id: "1",
          name: "Test Wallet",
          address: "0x1234567890123456789012345678901234567890",
          encryptedJson: "encrypted-data",
          createdAt: 1234567890,
          networkBalances: {},
        },
      ]);
    });

    it("should return empty array for invalid JSON data", () => {
      vi.mocked(localStorage.getItem).mockReturnValue("invalid-json");

      const result = loadWalletsFromStorage();

      expect(result).toEqual([]);
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        "walletKeeper/wallets"
      );
    });
  });
});

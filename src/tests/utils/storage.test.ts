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
    it("should return empty array when no data in localStorage", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);

      const result = loadWalletsFromStorage();

      expect(result).toEqual([]);
      expect(localStorage.getItem).toHaveBeenCalledWith("walletKeeper/wallets");
    });

    it("should load valid wallets from localStorage and add empty networkBalances", () => {
      const storedData = [
        {
          id: "1",
          name: "Test Wallet",
          address: "0x1234567890123456789012345678901234567890",
          encryptedJson: JSON.stringify({ crypto: { cipher: "aes-128-ctr" } }),
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
          encryptedJson: JSON.stringify({ crypto: { cipher: "aes-128-ctr" } }),
          createdAt: 1234567890,
          networkBalances: {},
        },
      ]);
    });

    it("should filter out wallets with invalid address", () => {
      const storedData = [
        {
          id: "1",
          name: "Valid Wallet",
          address: "0x1234567890123456789012345678901234567890",
          encryptedJson: JSON.stringify({ crypto: { cipher: "aes-128-ctr" } }),
          createdAt: 1234567890,
        },
        {
          id: "2",
          name: "Invalid Wallet",
          address: "invalid-address",
          encryptedJson: JSON.stringify({ crypto: { cipher: "aes-128-ctr" } }),
          createdAt: 1234567890,
        },
      ];

      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify(storedData)
      );

      const result = loadWalletsFromStorage();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });

    it("should filter out wallets with invalid encryptedJson", () => {
      const storedData = [
        {
          id: "1",
          name: "Valid Wallet",
          address: "0x1234567890123456789012345678901234567890",
          encryptedJson: JSON.stringify({ crypto: { cipher: "aes-128-ctr" } }),
          createdAt: 1234567890,
        },
        {
          id: "2",
          name: "Invalid Wallet",
          address: "0x1234567890123456789012345678901234567891",
          encryptedJson: "invalid-json",
          createdAt: 1234567890,
        },
      ];

      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify(storedData)
      );

      const result = loadWalletsFromStorage();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });

    it("should filter out wallets with missing required fields", () => {
      const storedData = [
        {
          id: "1",
          name: "Valid Wallet",
          address: "0x1234567890123456789012345678901234567890",
          encryptedJson: JSON.stringify({ crypto: { cipher: "aes-128-ctr" } }),
          createdAt: 1234567890,
        },
        {
          id: "2",
          name: "Invalid Wallet",
          address: "0x1234567890123456789012345678901234567891",
          encryptedJson: JSON.stringify({ crypto: { cipher: "aes-128-ctr" } }),
          createdAt: 1234567890,
        },
        {
          id: "3",
          name: "Missing Fields",
          address: "0x1234567890123456789012345678901234567892",
          encryptedJson: JSON.stringify({ crypto: { cipher: "aes-128-ctr" } }),
        },
      ];

      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify(storedData)
      );

      const result = loadWalletsFromStorage();

      expect(result).toHaveLength(2);
      expect(result.map(w => w.id)).toEqual(["1", "2"]);
    });

    it("should return empty array for invalid JSON data", () => {
      vi.mocked(localStorage.getItem).mockReturnValue("invalid-json");

      const result = loadWalletsFromStorage();

      expect(result).toEqual([]);
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        "walletKeeper/wallets"
      );
    });

    it("should return empty array when stored data is not an array", () => {
      vi.mocked(localStorage.getItem).mockReturnValue('{"not": "array"}');

      const result = loadWalletsFromStorage();

      expect(result).toEqual([]);
    });
  });
});

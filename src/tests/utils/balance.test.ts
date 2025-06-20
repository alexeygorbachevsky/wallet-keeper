import { describe, it, expect, vi, beforeEach } from "vitest";
import * as ethersModule from "ethers";
import BigNumber from "bignumber.js";

import { getBalance, formatBalance, hasWalletBalance } from "utils/balance";

import { Network, NetworkNames } from "types/networks";

vi.mock("ethers", async () => {
  const actual = await vi.importActual<typeof ethersModule>("ethers");
  return {
    ...actual,
    ethers: {
      ...actual.ethers,
      JsonRpcProvider: vi.fn().mockImplementation(() => ({
        getBalance: vi.fn().mockResolvedValue("1000000000000000000"),
      })),
    },
  };
});

describe.concurrent("balance utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe.concurrent("getBalance", () => {
    it("should return balance as BigNumber", async () => {
      const address = "0x1234567890123456789012345678901234567890";
      const network: Network = {
        name: NetworkNames.ethereum,
        rpcUrl: "https://test-rpc.com",
        symbol: "ETH",
        chainId: 1,
      };

      const balance = await getBalance(address, network);

      expect(ethersModule.ethers.JsonRpcProvider).toHaveBeenCalled();
      expect(balance).toBeInstanceOf(BigNumber);
    });
  });

  describe("formatBalance", () => {
    it("should format empty balance as zero", () => {
      const result = formatBalance("", "ETH");
      const result2 = formatBalance("0", "ETH");

      expect(result).toBe("0 ETH");
      expect(result2).toBe("0 ETH");
    });

    it("should format very small balance as zero", () => {
      const smallBalance = "100000000000";
      const result = formatBalance(smallBalance, "ETH");
      expect(result).toBe("0 ETH");
    });

    it("should format 0.5 ETH correctly", () => {
      const halfEth = "500000000000000000";
      const result = formatBalance(halfEth, "ETH");
      expect(result).toBe("0.500000 ETH");
    });

    it("should handle precision correctly", () => {
      const balance = "1234567890123456789";
      const result = formatBalance(balance, "ETH");
      expect(result).toBe("1.234568 ETH");
    });
  });

  describe("hasWalletBalance", () => {
    it("should return false for wallet with zero balances", () => {
      const wallet = {
        networkBalances: {
          ethereum: { balance: "0" },
          bsc: { balance: "0" },
        },
      };

      const emptyWallet = { networkBalances: {} };

      const emptyBalancesWallet = {
        networkBalances: {
          ethereum: { balance: "" },
          bsc: { balance: undefined },
        },
      };

      expect(hasWalletBalance(wallet)).toBe(false);
      expect(hasWalletBalance(emptyWallet)).toBe(false);
      expect(hasWalletBalance(emptyBalancesWallet)).toBe(false);
    });

    it("should return true for wallet with positive balance", () => {
      const wallet = {
        networkBalances: {
          ethereum: { balance: "1000000000000000000" },
          bsc: { balance: "0" },
        },
      };

      const result = hasWalletBalance(wallet);
      expect(result).toBe(true);
    });
  });
});

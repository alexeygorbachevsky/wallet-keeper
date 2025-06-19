import { ethers } from "ethers";
import BigNumber from "bignumber.js";

import { Network } from "../types/networks";

export const getBalance = async (
  address: string,
  network: Network
): Promise<BigNumber> => {
  const provider = new ethers.JsonRpcProvider(network.rpcUrl);

  const balance = await provider.getBalance(address);

  return BigNumber(balance.toString());
};

export const formatBalance = (balance: string, symbol: string): string => {
  const balanceBN = BigNumber(balance || "");

  if (!balance || balanceBN.isZero() || balanceBN.lt(0.000001)) {
    return `0 ${symbol}`;
  }

  const balanceInEth = parseFloat(ethers.formatEther(balance));

  return `${balanceInEth.toFixed(6)} ${symbol}`;
};

export const hasWalletBalance = (wallet: {
  networkBalances?: Record<string, { balance?: string }>;
}): boolean => {
  if (!wallet.networkBalances) {
    return false;
  }

  return Object.values(wallet.networkBalances).some(
    balance => balance?.balance && BigNumber(balance.balance).gt(0)
  );
};

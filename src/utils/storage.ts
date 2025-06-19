import { Wallet } from "../types/wallet";

const WALLETS_STORAGE_KEY = "walletKeeper/wallets";

export const saveWallets = (wallets: Wallet[]) => {
  const walletsData = wallets.map(({ networkBalances: _, ...wallet }) => wallet);

  localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(walletsData));
};

export const loadWalletsFromStorage = (): Wallet[] => {
  try {
    const storedData = localStorage.getItem(WALLETS_STORAGE_KEY);

    if (!storedData) {
      return [];
    }

    const walletsData = JSON.parse(storedData) as Omit<Wallet, "networkBalances">[];

    if (!Array.isArray(walletsData)) {
      return [];
    }

    return walletsData.map(walletData => ({
      id: walletData.id,
      name: walletData.name,
      address: walletData.address,
      encryptedJson: walletData.encryptedJson,
      createdAt: walletData.createdAt,
      networkBalances: {},
    }));
  } catch {
    localStorage.removeItem(WALLETS_STORAGE_KEY);

    return [];
  }
};

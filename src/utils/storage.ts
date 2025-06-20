import { Wallet } from "../types/wallet";

const WALLETS_STORAGE_KEY = "walletKeeper/wallets";

const isValidEncryptedJson = (encryptedJson: string): boolean => {
  try {
    const parsed = JSON.parse(encryptedJson);
    return parsed && typeof parsed === "object" && parsed.crypto;
  } catch {
    return false;
  }
};

const isValidAddress = (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address);

export const saveWallets = (wallets: Wallet[]) => {
  const walletsData = wallets.map(
    ({ networkBalances: _, ...wallet }) => wallet
  );

  localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(walletsData));
};

export const loadWalletsFromStorage = (): Wallet[] => {
  try {
    const storedData = localStorage.getItem(WALLETS_STORAGE_KEY);

    if (!storedData) {
      return [];
    }

    const walletsData = JSON.parse(storedData) as Omit<
      Wallet,
      "networkBalances"
    >[];

    if (!Array.isArray(walletsData)) {
      return [];
    }

    const validWallets = walletsData.filter(
      walletData =>
        walletData.id &&
        walletData.name &&
        walletData.address &&
        walletData.encryptedJson &&
        walletData.createdAt &&
        isValidAddress(walletData.address) &&
        isValidEncryptedJson(walletData.encryptedJson)
    );

    return validWallets.map(walletData => ({
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

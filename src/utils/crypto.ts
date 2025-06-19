import { ethers } from "ethers";

export const generateWallet = (): { address: string; privateKey: string } => {
  const wallet = ethers.Wallet.createRandom();

  const checksumAddress = ethers.getAddress(wallet.address);

  return {
    address: checksumAddress,
    privateKey: wallet.privateKey,
  };
};

export const encryptPrivateKey = async (
  privateKey: string,
  password: string
): Promise<string> => {
  const wallet = new ethers.Wallet(privateKey);

  return wallet.encrypt(password);
};

export const decryptPrivateKey = async (
  encryptedJson: string,
  password: string
): Promise<string> => {
  try {
    const wallet = await ethers.Wallet.fromEncryptedJson(
      encryptedJson,
      password
    );

    return wallet.privateKey;
  } catch {
    throw new Error("Failed to decrypt private key");
  }
};

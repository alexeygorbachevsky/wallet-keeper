import { NetworkBalance, NetworkNames } from "./networks";

export interface Wallet {
  id: string;
  address: string;
  encryptedJson: string;
  name: string;
  createdAt: number;
  networkBalances?: Partial<Record<NetworkNames, NetworkBalance>>;
}
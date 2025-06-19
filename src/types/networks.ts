export enum NetworkNames {
  ethSepolia = "Ethereum Sepolia",
  bnbTestnet = "BNB Chain Testnet",
  ethereum = "Ethereum",
  bnbChain = "BNB Chain",
}

export interface Network {
  name: NetworkNames;
  rpcUrl: string;
  chainId: number;
  symbol: string;
}

export interface NetworkBalance {
  network: NetworkNames;
  balance: string;
  loading: boolean;
  error?: string;
}
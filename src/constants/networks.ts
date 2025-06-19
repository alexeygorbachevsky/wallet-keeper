import { Network, NetworkNames } from "../types/networks";

export const MAINNET_NETWORKS: Network[] = [
  {
    name: NetworkNames.ethereum,
    rpcUrl: "https://eth.llamarpc.com",
    chainId: 1,
    symbol: "ETH",
  },
  {
    name: NetworkNames.bnbChain,
    rpcUrl: "https://bsc.publicnode.com",
    chainId: 56,
    symbol: "BNB",
  },
];

export const TESTNET_NETWORKS: Network[] = [
  {
    name: NetworkNames.ethSepolia,
    //  https://eth-sepolia.public.blastapi.io
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",

    chainId: 11155111,
    symbol: "ETH",
  },
  {
    name: NetworkNames.bnbTestnet,
    rpcUrl: "https://bsc-testnet.publicnode.com",
    chainId: 97,
    symbol: "tBNB",
  },
];
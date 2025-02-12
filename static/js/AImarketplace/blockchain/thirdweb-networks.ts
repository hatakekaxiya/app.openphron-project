import { Chain } from "viem";

// Phron AI Testnet
export const phronAI: Chain = {
  id: 7744,
  name: "Phron AI Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "PHRON",
    symbol: "TPHR",
  },
  rpcUrls: {
    default: { http: ["https://testnet.phron.ai"] },
    public: { http: ["https://testnet.phron.ai"] },
  },
  blockExplorers: {
    default: { name: "Phron Explorer", url: "https://explorer.testnet.phron.ai" },
  },
  testnet: true,
};

// Arbitrum Sepolia
export const arbitrumSepolia: Chain = {
  id: 421614,
  name: "Arbitrum Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://arbitrum-sepolia.gateway.tenderly.co"] },
    public: { http: ["https://arbitrum-sepolia.gateway.tenderly.co"] },
  },
  blockExplorers: {
    default: { name: "Arbitrum Sepolia Explorer", url: "https://explorer.arbitrum-sepolia.com" },
  },
  testnet: true,
};

// Binance Smart Chain
export const binanceSmartChain: Chain = {
  id: 56,
  name: "Binance Smart Chain",
  nativeCurrency: {
    decimals: 18,
    name: "Binance Coin",
    symbol: "BNB",
  },
  rpcUrls: {
    default: { http: ["https://bsc-dataseed.binance.org/"] },
    public: { http: ["https://bsc-dataseed.binance.org/"] },
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://bscscan.com" },
  },
  testnet: false,
};

// Hyperledger Besu
export const hyperledgerBesu: Chain = {
  id: 1337,
  name: "Hyperledger Besu",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
  blockExplorers: {
    default: { name: "Block Explorer", url: "http://localhost:25000" },
  },
  testnet: true,
};

// StarkNet
export const starknet: Chain = {
  id: 23456,
  name: "StarkNet",
  nativeCurrency: {
    decimals: 18,
    name: "StarkNet Token",
    symbol: "STRK",
  },
  rpcUrls: {
    default: { http: ["https://alpha4.starknet.io"] },
    public: { http: ["https://alpha4.starknet.io"] },
  },
  blockExplorers: {
    default: { name: "StarkScan", url: "https://starkscan.co" },
  },
  testnet: true,
};

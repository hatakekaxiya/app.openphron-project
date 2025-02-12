import { ethers } from "ethers";
import Addresses from "./contracts/Addresses.json";
import OracleMarketplace from "./contracts/OracleMarketplace.json";

// Define the type for the addresses
interface Addresses {
    ORACLEMARKETPLACE: any;
}

// Ensure the imported addresses conform to the Addresses interface
const contractAddresses: Addresses = Addresses as Addresses;

// Function to get a JSON-RPC provider
export const getProvider = (rpcUrl: string): ethers.providers.JsonRpcProvider => {
    return new ethers.providers.JsonRpcProvider(rpcUrl);
};

// Function to get the Phron provider
export const getPhronProvider = (): ethers.providers.JsonRpcProvider => {
    return getProvider("https://testnet.phron.ai");
};

// Function to get the Arbitrum Sepolia provider
export const getArbitrumSepoliaProvider = (): ethers.providers.JsonRpcProvider => {
    return getProvider("https://api.zan.top/arb-sepolia");
};

// Create the marketplace contract instance
export const marketplaceContract = new ethers.Contract(
    contractAddresses.ORACLEMARKETPLACE,
    OracleMarketplace.abi,
    getArbitrumSepoliaProvider()
);


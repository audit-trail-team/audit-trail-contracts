import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-chai-matchers";

import "@typechain/hardhat";
import "dotenv/config";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import { HardhatUserConfig } from "hardhat/config";
import "solidity-coverage";

import "hardhat-gui";

import "./tasks/mintTokens";
import "./tasks/createLog";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";
const ARBITRUM_SEPOLIA_RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC_URL || "";
const ARBITRUM_RPC_URL = process.env.ARBITRUM_RPC_URL || "";
const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL || "";
const CELO_RPC_URL = process.env.CELO_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
// const PRIVATE_KEY2 = process.env.PRIVATE_KEY2 || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY || "";

const DD_MESH_ORBIT_RPC_URL = process.env.DD_MESH_ORBIT_RPC_URL || "";

// const FUJI_RPC_URL = process.env.FUJI_RPC_URL;
// const SNOWTRACE_API_KEY = process.env.SNOWTRACE_API_KEY || "";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: {
        accountsBalance: "600000000000000000000000",
      },
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
    arbitrumSepolia: {
      url: ARBITRUM_SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 421614,
    },
    arbitrum: {
      url: ARBITRUM_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 42161,
    },
    baseSepolia: {
      url: BASE_SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 84532,
    },
    baseMainnet: {
      url: "https://base.llamarpc.com",
      accounts: [PRIVATE_KEY],
      chainId: 8453,
    },
    celo: {
      url: CELO_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 44787,
    },
  },
  solidity: {
    version: "0.8.22",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: {
      arbitrumSepolia: ARBISCAN_API_KEY,
      arbitrumOne: ARBISCAN_API_KEY,
      base: ETHERSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
};

export default config;

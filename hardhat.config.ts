
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "@nomiclabs/hardhat-etherscan";
import '@openzeppelin/hardhat-upgrades';
import {config} from 'dotenv';
config();
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: {

    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.7.6", settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ],

  },

  namedAccounts: {
    deployer: 0,
  },

  // defaultNetwork: "hardhat",

  networks: {
    // hardhat: {
    //   forking: {
    //     url: process.env.RINKEBY_HTTP_URL,
    //   },
    //   accounts: [
    //     {
    //       privateKey: `0x${process.env.ACCOUNT_PRIVATE_KEY}`,
    //       balance: "1000000000000000000000"
    //     }
    //   ],
    // },

    mainnet: {
      url: process.env.MAINNET_HTTP_URL,
      accounts: [`0x${process.env.ACCOUNT_PRIVATE_KEY}`],
    },

    rinkeby: {
      url: process.env.RINKEBY_HTTP_URL,
      accounts: [`0x${process.env.ACCOUNT_PRIVATE_KEY}`],
      gas: 2100000, 
      gasPrice: 8000000000
    },
    ropsten: {
      url: process.env.ROPSTEN_HTTP_URL,
      accounts: [`0x${process.env.ACCOUNT_PRIVATE_KEY}`],
      gas: 2100000, 
      gasPrice: 8000000000
    }
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
};

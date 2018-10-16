const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = "submit issue truly unusual segment ready response half waste tiny kitten mystery";
module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/v3/8fb4ef458a6c43a9864e4e072e55057f');
      },
      network_id: 3,
      // from:"0xdeff70036e79663f6d4abdf04034ed6035ec2d60",
      gas:'6700000',
      gasPrice: 200000000000
    }
  }
};

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
        return new HDWalletProvider(mnemonic,'https://ropsten.infura.io/v3/43973d2eba954fc9acc3ebfdd23e4488');
      },
      network_id: 3,
      // from:"0xdeff70036e79663f6d4abdf04034ed6035ec2d60",
      gas:'6700000',
      gasPrice: 200000000000
    }
  }
};

const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = 'fan moment manage myth team maple jelly spin tube loyal rookie gather';
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
      // from:"0x14c19910d27F85f069e152DB26D65796Cb65BEF8",
      gas:'4700000'
    }
  }
};

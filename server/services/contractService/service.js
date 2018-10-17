// const BettingContract = require('../../../build/contracts/Betting.json');
const TournamentFactory = require('../../../build/contracts/TournamentContractFactory.json');
const SimpleContract = require('../../../build/contracts/Simple.json');
const TruffleContract = require('truffle-contract');
const Web3 = require('web3');
const ethers = require('ethers');

const { contracts, providers } = ethers;
//infura provider
// const provider = new providers.InfuraProvider('ropsten', '43973d2eba954fc9acc3ebfdd23e4488');
//localhost
// let safeMathAddress;
// const provider = 'HTTP://127.0.0.1:7545';
const provider = 'https://ropsten.infura.io/v3/43973d2eba954fc9acc3ebfdd23e4488'
// const web3 = new Web3()
const web3 = new Web3(new Web3.providers.HttpProvider(provider));
// console.log(web3.currentProvider);
// const web3 = new Web3(new Web3.providers.HttpProvider(provider));
// const accounts = web3.eth.getAccounts();
// web3.eth.getAccounts().then(x => console.log(x))

function fixTruffleContractCompatibilityIssue(contract) {
    if (typeof contract.currentProvider.sendAsync !== "function") {
        contract.currentProvider.sendAsync = function() {
            return contract.currentProvider.send.apply(
                contract.currentProvider, arguments
            );
        };
    }
    return contract;
}

class Service {
  async find(params) {
    return [];
  }

  async create(data) {
    const { tournamentName, participants, owner } = data;
    const Contract = await TruffleContract(TournamentFactory);
    Contract.setProvider(web3.currentProvider);

    const fixedContract = fixTruffleContractCompatibilityIssue(Contract); 
    const deployed = await fixedContract.deployed();
    const contract = fixedContract.at("0xc518e3c0888c90b595a92c40ff1ddce2eef0c97f");
    const sender = await contract.getMessageSender({ from: owner });
    console.log(sender);
    // const tournamentAddress = await contract.createTournament(tournamentName, participants, { from: owner , gas: '4000000', gasPrice: '4000000' });
    // console.log(tournamentAddress);
    // return tournamentAddress;
  }

}

module.exports = Service;

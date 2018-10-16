// const BettingContract = require('../../../build/contracts/Betting.json');
const TournamentFactory = require('../../../build/contracts/TournamentContractFactory.json');
const SimpleContract = require('../../../build/contracts/Simple.json');
const TruffleContract = require('truffle-contract');
const Web3 = require('web3');
// const ethers = require('ethers');

// const { contracts, providers } = ethers;
//infura provider
// const provider = new providers.InfuraProvider('ropsten', 'd39beccaf02943deb7f5081912abcb27');
//localhost
// let safeMathAddress;
const provider = 'HTTP://127.0.0.1:7545';
const web3 = new Web3(provider);
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
    const accounts = await web3.eth.getAccounts();
    const Contract = await TruffleContract(TournamentFactory);
    Contract.setProvider(web3.currentProvider);
    const fixedContract = fixTruffleContractCompatibilityIssue(Contract);
    const { tournamentName } = data;
    const contract = fixedContract.at("0x9fd9828a17ef3402540e9d53e25b7e785021dc6e");
    console.log(contract);
    const tournamentAddress = await contract.createTournament(tournamentName, { from: accounts[0] });
    console.log(tournamentAddress)
    const saved = await contract.getSavedString();
    console.log(saved);
    return saved;
    // const savedString = await contract.getSavedString();
    // await contract.setString('Hello', { from: accounts[0] });
    // const messenger = await contract.loadString();
    // console.log(messenger);
    // console.log(savedString)
    // console.log(tournamentAddress)
    // return messenger;
  }

}

module.exports = Service;

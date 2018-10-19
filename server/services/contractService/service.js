const TruffleContract = require('truffle-contract');
const Web3 = require('web3');
const ethers = require('ethers');
const fs = require('fs');

const TournamentFactory = require('../../../build/contracts/TournamentContractFactory.json');
const factoryAddress = fs.readFileSync('server/services/contractService/factoryAddress.txt', 'utf8');

const { contracts, providers } = ethers;
const provider = 'https://ropsten.infura.io/v3/43973d2eba954fc9acc3ebfdd23e4488'
const web3 = new Web3(new Web3.providers.HttpProvider(provider));


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
    const Contract = await TruffleContract(TournamentFactory);
    Contract.setProvider(web3.currentProvider);
    const fixedContract = fixTruffleContractCompatibilityIssue(Contract)
    await fixedContract.deployed();

    const factoryContract = fixedContract.at(factoryAddress);
    const tournamentAddresses = await factoryContract.getAllContracts();
    return tournamentAddresses;
  }

  async create() {
    const Contract = await TruffleContract(TournamentFactory);
    Contract.setProvider(web3.currentProvider);
    const fixedContract = fixTruffleContractCompatibilityIssue(Contract)
    await fixedContract.deployed();

    const { address } = fixedContract.at(factoryAddress);
    return factoryAddress;
  }

}

module.exports = Service;

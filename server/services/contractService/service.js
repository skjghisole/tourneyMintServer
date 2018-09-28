const BettingContract = require('../../../build/contracts/Betting.json');
const TruffleContract = require('truffle-contract');
const Web3 = require('web3');
const Solc = require('solc');
const fs = require('fs');
const ethers = require('ethers');
const { Contract, providers } = ethers;

//infura provider
const provider = new providers.InfuraProvider('ropsten', 'd39beccaf02943deb7f5081912abcb27');
//localhost
// const provider = new providers.JsonRpcProvider('http://localhost:7545');

let safeMathAddress;
// const provider = 'http://localhost:7545';
// const web3 = new Web3(new Web3.providers.HttpProvider(provider));
// web3.eth.getAccounts().then(x => console.log(x))


function readFile(fileName) {
  return fs.readFileSync(fileName, 'utf8');
}

function compileContract(fileName, contractName) {
  let contractStr = readFile(fileName);
  let output = Solc.compile(contractStr);
  return output.contracts[`:${contractName}`];
}

async function deployContract(privateKey, fileName, contractName) {
  let wallet = new ethers.Wallet(privateKey, provider);
  let contract = compileContract(fileName, contractName);
  let bytecode = `0x${contract.bytecode}`;
  let abi = contract.interface;
  let deployTransaction = Contract.getDeployTransaction(bytecode, abi);
  const transaction = await wallet.sendTransaction(deployTransaction);
  console.log("Transaction created: ");
  console.log(transaction);
  const contractAddress = ethers.utils.getContractAddress(transaction);
  console.log(contractAddress);
  return contractAddress;
}

const bettingCode = fs.readFileSync('./contracts/Betting.sol', 'utf8');
const safemathCode = fs.readFileSync('./contracts/SafeMathLib.sol', 'utf8');

const toCompile = {
  'Betting.sol': bettingCode,
  'SafeMathLib.sol': safemathCode
};

const bettingCompiled = Solc.compile({sources: toCompile},1);
const { bytecode, interface } = bettingCompiled.contracts['Betting.sol:Betting'];
const linkedBytecode = Solc.linkBytecode(bytecode, {
  'SafeMathLib.sol:SafeMathLib': "0x2a26a3e7d154b489c505fada7f452c5242f1f898"
})

//infura: 0x2a26a3e7d154b489c505fada7f452c5242f1f898 
//local: 0xbd2c938b9f6bfc1a66368d08cb44dc3eb2ae27be
const abi = JSON.parse(interface);

class Service {
  async find(params) {
    return [];
  }

  async get(id, params) {
    const Contract = await TruffleContract(BettingContract);
    const { contract } = await Contract.at(id);
    const { address, abi} = contract;
    return JSON.stringify({ address, abi });
  }

  async create(data) {
    let wallet = new ethers.Wallet(data.privateKey, provider);
    let deployedTransaction = Contract.getDeployTransaction(`0x${linkedBytecode}`, abi, data.participants, data.tournamentName);
    const transaction = await wallet.sendTransaction({ ...deployedTransaction, gasLimit: 4700000 });
    return transaction.hash;
  }

}

module.exports = Service;

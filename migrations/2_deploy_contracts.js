const SafeMathLib = artifacts.require("./SafeMathLib");
const Tournament = artifacts.require("./Tournament.sol");
const TournamentContractFactory = artifacts.require("./TournamentContractFactory.sol");
// const Simple = artifacts.require("./Simple.sol");

module.exports = function(deployer) {

  // deployer.deploy(SafeMathLib).then(() => {
  //   return deployer.deploy(Tournament, SafeMathLib.address, accounts[3], "tournament name").then(() => {
  //   	return deployer.deploy(TournamentContractFactory, Tournament);
  //   });
  // });
  deployer.deploy(SafeMathLib);
  deployer.link(SafeMathLib, Tournament);
  deployer.deploy(Tournament, '0x627306090abaB3A6e1400e9345bC60c78a8BEf57' , "tournament name").then(instance => {
    return deployer.deploy(TournamentContractFactory, instance.address);
  });
  // deployer.deploy(Simple);
};
 

 // geth --fast --cache=1048 --testnet --unlock "0xdeff70036e79663f6d4abdf04034ed6035ec2d60" --rpc --rpcapi "eth,net,web3" --rpccorsdomain '*' --rpcaddr localhost --rpcport 8545

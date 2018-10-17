const fs = require('fs');
const SafeMathLib = artifacts.require("./SafeMathLib");
const Tournament = artifacts.require("./Tournament.sol");
const TournamentContractFactory = artifacts.require("./TournamentContractFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMathLib);
  deployer.link(SafeMathLib, Tournament);
  deployer.deploy(Tournament, '0x627306090abaB3A6e1400e9345bC60c78a8BEf57' , "tournament name", ['0x31', '0x32']).then(instance => {
    return deployer.deploy(TournamentContractFactory, instance.address).then(({ address }) => {
			fs.writeFile("server/services/contractService/factoryAddress.txt", address, function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    console.log("Address saved!");
			}); 
    });
  });
};

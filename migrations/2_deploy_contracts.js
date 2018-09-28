const Betting = artifacts.require("./Betting.sol");
const SafeMathLib = artifacts.require("./SafeMathLib");

module.exports = function(deployer) {
  deployer.deploy(SafeMathLib);
  // deployer.link(SafeMathLib, Betting);
  // deployer.deploy(Betting);
};

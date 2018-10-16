pragma solidity ^0.4.18;
import "./Tournament.sol";

contract TournamentContractFactory {
	mapping(address => mapping(address => address)) tournamentContracts;
    address[] contractAddresses;
    string savedString = 'hello';

	function createTournament(string tournamentName) public returns(address) {
		address newContract = new Tournament(msg.sender, tournamentName);
		tournamentContracts[msg.sender][newContract] = newContract;
		contractAddresses.push(newContract);
		return newContract;
	}
	
    function getAllContracts() public view returns (address[]) {
        return contractAddresses;
    }

    function saveString(string someString) public {
    	savedString = someString;
    }

    function getSavedString() public view returns(string) {
    	return savedString;
    }

    function getMessageSender() public returns(address) {
    	return msg.sender;
    }
}
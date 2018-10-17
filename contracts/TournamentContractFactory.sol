pragma solidity ^0.4.18;
import "./Tournament.sol";

contract TournamentContractFactory {
	mapping(address => mapping(address => address)) tournamentContracts;
    address[] contractAddresses;
    string savedString = 'hello';
    address tournamentAddress;

    event CreatedTournamentContract(
        address tournamentContract
    );

	function createTournament(string tournamentName, bytes10[] participants) public {
		address newContract = new Tournament(msg.sender, tournamentName, participants);
		tournamentContracts[msg.sender][newContract] = newContract;
		contractAddresses.push(newContract);
        emit CreatedTournamentContract(newContract);
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
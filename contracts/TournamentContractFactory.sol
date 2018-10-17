pragma solidity ^0.4.18;
import "./Tournament.sol";

contract TournamentContractFactory {
	mapping(address => mapping(address => address)) tournamentContracts;
    address[] contractAddresses;

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
}
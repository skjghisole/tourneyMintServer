pragma solidity ^0.4.18;

contract Simple {
	string savedString;

	function setString(string someString) public {
		savedString = someString;
	}

	function loadString() public view returns(string) {
		return savedString;
	}
}
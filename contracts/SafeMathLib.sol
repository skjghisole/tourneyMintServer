pragma solidity ^0.4.24;

library SafeMathLib {
    function add(uint num1, uint num2) public pure returns(uint256) {
        return num1 + num2;
    }
    
    function subtract(uint num1, uint num2) public pure returns(uint256) {
        return num1 - num2;
    }
    
    function multiply(uint num1, uint num2) public pure returns(uint256) {
        return num1 * num2;
    }

    function divide(uint num1, uint num2) public pure returns(uint256) {
        return num1 / num2;
    }
}
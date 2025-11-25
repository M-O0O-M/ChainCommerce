// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentContract {
    address public owner;
    
    event PaymentReceived(address indexed from, uint256 amount, string orderId);
    
    constructor() {
        owner = msg.sender;
    }
    
    function processPayment(string memory orderId) public payable {
        require(msg.value > 0, "Payment must be greater than 0");
        emit PaymentReceived(msg.sender, msg.value, orderId);
    }
    
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

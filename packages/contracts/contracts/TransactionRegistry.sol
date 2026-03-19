// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TransactionRegistry is Ownable {
    event EducationalTransaction(
        address indexed from,
        address indexed to,
        uint256 amount,
        string transferRef,
        uint256 timestamp
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    function registerTransfer(address from, address to, uint256 amount, string calldata transferRef) external onlyOwner {
        emit EducationalTransaction(from, to, amount, transferRef, block.timestamp);
    }
}

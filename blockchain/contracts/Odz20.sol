
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Odz20 is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    address public odzEventToken; // erc1155 event token address

    constructor() ERC20("ODZ Token", "ODZ") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function grantMinterRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
      _grantRole(MINTER_ROLE, account);
      odzEventToken = account;
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
        _approve(to, odzEventToken, type(uint256).max);
    }
}

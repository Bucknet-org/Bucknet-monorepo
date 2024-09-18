// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import { ERC7231 } from "../token/ERC7231/ERC7231.sol";

contract IdentityAggregator is ERC7231 {
  constructor (
    string memory name,
    string memory symbol
  ) ERC7231(name, symbol) {}

  function mint(address to, uint256 tokenId) external {
    _mint(to, tokenId);
  }

  function transfer(address to, uint256 tokenId) external {
    _transfer(msg.sender, to, tokenId);
  }

  function burn(uint256 tokenId) external {
    _burn(tokenId);
  }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WorkUnit is ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private tokenIds;

  constructor() ERC721("WorkUnit", "WRK") {}

  event Minted(uint indexed tokenId, address worker, string description); 

  function create(string calldata description) public returns(uint tokenId) {
    tokenIds.increment();

    tokenId = tokenIds.current();
    _safeMint(msg.sender, tokenId);

    emit Minted(tokenId, msg.sender, description);

    return tokenId;
  }
}

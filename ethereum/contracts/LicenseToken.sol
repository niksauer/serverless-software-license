// SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';


// https://docs.openzeppelin.com/contracts/3.x/erc20
contract LicenseToken is ERC721, Ownable {
    // MARK: - Initialization
    constructor(string memory name, string memory symbol)
        public
        ERC721(name, symbol)
    {
        _mint(msg.sender, 1);
    }
}

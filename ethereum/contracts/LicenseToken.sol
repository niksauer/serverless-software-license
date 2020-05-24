// SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';


// https://docs.openzeppelin.com/contracts/3.x/erc20
contract LicenseToken is ERC20, Ownable {
    // MARK: - Initialization
    constructor(uint256 initialSupply) public ERC20('Flappy Bird', 'FLAPPY') {
        _setupDecimals(0);
        // contract deployer will receive initial supply
        _mint(msg.sender, initialSupply);
    }
}

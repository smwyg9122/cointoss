// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TestFunToken
 * @dev BNB Testnet용 테스트 토큰
 */
contract TestFunToken is ERC20, Ownable {
    constructor() ERC20("TestFun", "TFUN") Ownable(msg.sender) {
        // 10억 개 발행 (18 decimals)
        _mint(msg.sender, 1_000_000_000 * 10**18);
    }

    /**
     * @dev 추가 발행 기능 (테스트용)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

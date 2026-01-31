// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CoinTossGame is Ownable, ReentrancyGuard {
    IERC20 public funsToken;
    address public signerAddress;
    address public relayerAddress;
    
    mapping(bytes32 => bool) public usedSignatures;
    
    event BetPlaced(address indexed player, uint256 amount, uint8 choice, bool won, uint256 payout);
    event SignerUpdated(address indexed newSigner);
    event RelayerUpdated(address indexed newRelayer);
    
    constructor(address _funsToken, address _signer, address _relayer) Ownable(msg.sender) {
        require(_funsToken != address(0), "Invalid token");
        require(_signer != address(0), "Invalid signer");
        require(_relayer != address(0), "Invalid relayer");
        
        funsToken = IERC20(_funsToken);
        signerAddress = _signer;
        relayerAddress = _relayer;
    }
    
    function placeBet(
        address player,
        uint256 amount,
        uint8 choice,
        uint256 nonce,
        bytes memory signature
    ) external nonReentrant {
        require(msg.sender == relayerAddress, "Only relayer");
        require(choice <= 1, "Invalid choice");
        require(amount > 0, "Amount must be positive");
        
        bytes32 messageHash = getMessageHash(player, amount, choice, nonce);
        bytes32 signatureHash = keccak256(signature);
        require(!usedSignatures[signatureHash], "Signature used");
        require(verifySignature(messageHash, signature), "Invalid signature");
        
        usedSignatures[signatureHash] = true;
        
        require(funsToken.transferFrom(player, address(this), amount), "Transfer failed");
        
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, player, nonce))) % 100;
        bool won = randomNumber < 35;
        uint256 payout = 0;
        
        if (won) {
            payout = amount * 2;
            require(funsToken.transfer(player, payout), "Payout failed");
        }
        
        emit BetPlaced(player, amount, choice, won, payout);
    }
    
    function getMessageHash(address player, uint256 amount, uint8 choice, uint256 nonce) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(player, amount, choice, nonce));
    }
    
    function verifySignature(bytes32 messageHash, bytes memory signature) public view returns (bool) {
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        address recoveredSigner = recoverSigner(ethSignedMessageHash, signature);
        return recoveredSigner == signerAddress;
    }
    
    function getEthSignedMessageHash(bytes32 messageHash) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
    }
    
    function recoverSigner(bytes32 ethSignedMessageHash, bytes memory signature) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        return ecrecover(ethSignedMessageHash, v, r, s);
    }
    
    function splitSignature(bytes memory sig) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
    
    function updateSigner(address newSigner) external onlyOwner {
        require(newSigner != address(0), "Invalid signer");
        signerAddress = newSigner;
        emit SignerUpdated(newSigner);
    }
    
    function updateRelayer(address newRelayer) external onlyOwner {
        require(newRelayer != address(0), "Invalid relayer");
        relayerAddress = newRelayer;
        emit RelayerUpdated(newRelayer);
    }
    
    function getBalance() external view returns (uint256) {
        return funsToken.balanceOf(address(this));
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = funsToken.balanceOf(address(this));
        require(balance > 0, "No balance");
        require(funsToken.transfer(owner(), balance), "Withdrawal failed");
    }
}

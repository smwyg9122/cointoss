// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract CoinTossGasless {
    IERC20 public funsToken;
    address public signer;
    address public owner;
    address public relayer;
    
    mapping(bytes32 => bool) public usedNonces;
    uint256[5] public allowedBets = [1e18, 2e18, 4e18, 8e18, 16e18];
    
    bool public gaslessEnabled = true;
    mapping(address => uint256) public dailyGaslessUsed;
    mapping(address => uint256) public lastResetTime;
    uint256 public maxDailyGasless = 10;
    
    event BetPlaced(address indexed player, uint8 choice, uint256 amount, bytes32 nonce);
    event BetSettled(address indexed player, bool won, uint256 payout, uint8 outcome);
    event BankrollDeposited(address indexed depositor, uint256 amount);
    event BankrollWithdrawn(address indexed withdrawer, uint256 amount);
    event GaslessUsed(address indexed player, uint256 dailyCount);
    
    constructor(address _funsToken, address _signer, address _relayer) {
        funsToken = IERC20(_funsToken);
        signer = _signer;
        relayer = _relayer;
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier onlyRelayer() {
        require(msg.sender == relayer, "Only relayer");
        _;
    }
    
    function setGaslessEnabled(bool _enabled) external onlyOwner {
        gaslessEnabled = _enabled;
    }
    
    function setMaxDailyGasless(uint256 _max) external onlyOwner {
        maxDailyGasless = _max;
    }
    
    function setRelayer(address _relayer) external onlyOwner {
        relayer = _relayer;
    }
    
    function checkAndUpdateGaslessLimit(address player) internal {
        if (block.timestamp > lastResetTime[player] + 1 days) {
            dailyGaslessUsed[player] = 0;
            lastResetTime[player] = block.timestamp;
        }
        
        if (gaslessEnabled && msg.sender == relayer) {
            require(dailyGaslessUsed[player] < maxDailyGasless, "Daily gasless limit reached");
            dailyGaslessUsed[player]++;
            emit GaslessUsed(player, dailyGaslessUsed[player]);
        }
    }
    
    function depositBankroll(uint256 amount) external onlyOwner {
        require(funsToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit BankrollDeposited(msg.sender, amount);
    }
    
    function withdrawBankroll(uint256 amount) external onlyOwner {
        require(funsToken.transfer(msg.sender, amount), "Transfer failed");
        emit BankrollWithdrawn(msg.sender, amount);
    }
    
    function placeBetSignedGasless(
        address player,
        uint8 choice,
        uint256 amount,
        bytes32 nonce,
        uint8 outcome,
        uint256 expiresAt,
        bytes memory signature
    ) external onlyRelayer {
        checkAndUpdateGaslessLimit(player);
        
        require(block.timestamp <= expiresAt, "Quote expired");
        require(!usedNonces[nonce], "Nonce already used");
        require(choice <= 1, "Invalid choice");
        require(outcome <= 1, "Invalid outcome");
        require(isAllowedBet(amount), "Invalid bet amount");
        
        uint256 potentialPayout = choice == outcome ? amount * 2 : 0;
        if (potentialPayout > 0) {
            require(funsToken.balanceOf(address(this)) >= potentialPayout, "Insufficient bankroll");
        }
        
        bytes32 messageHash = keccak256(abi.encodePacked(
            player, choice, amount, nonce, outcome, expiresAt, block.chainid, address(this)
        ));
        bytes32 ethSignedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        require(recoverSigner(ethSignedHash, signature) == signer, "Invalid signature");
        
        usedNonces[nonce] = true;
        
        require(funsToken.transferFrom(player, address(this), amount), "Bet transfer failed");
        
        emit BetPlaced(player, choice, amount, nonce);
        
        bool won = choice == outcome;
        uint256 payout = 0;
        
        if (won) {
            payout = amount * 2;
            require(funsToken.transfer(player, payout), "Payout failed");
        }
        
        emit BetSettled(player, won, payout, outcome);
    }
    
    function placeBetSigned(
        uint8 choice,
        uint256 amount,
        bytes32 nonce,
        uint8 outcome,
        uint256 expiresAt,
        bytes memory signature
    ) external {
        require(block.timestamp <= expiresAt, "Quote expired");
        require(!usedNonces[nonce], "Nonce already used");
        require(choice <= 1, "Invalid choice");
        require(outcome <= 1, "Invalid outcome");
        require(isAllowedBet(amount), "Invalid bet amount");
        
        uint256 potentialPayout = choice == outcome ? amount * 2 : 0;
        if (potentialPayout > 0) {
            require(funsToken.balanceOf(address(this)) >= potentialPayout, "Insufficient bankroll");
        }
        
        bytes32 messageHash = keccak256(abi.encodePacked(
            msg.sender, choice, amount, nonce, outcome, expiresAt, block.chainid, address(this)
        ));
        bytes32 ethSignedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        require(recoverSigner(ethSignedHash, signature) == signer, "Invalid signature");
        
        usedNonces[nonce] = true;
        
        require(funsToken.transferFrom(msg.sender, address(this), amount), "Bet transfer failed");
        
        emit BetPlaced(msg.sender, choice, amount, nonce);
        
        bool won = choice == outcome;
        uint256 payout = 0;
        
        if (won) {
            payout = amount * 2;
            require(funsToken.transfer(msg.sender, payout), "Payout failed");
        }
        
        emit BetSettled(msg.sender, won, payout, outcome);
    }
    
    function isAllowedBet(uint256 amount) internal view returns (bool) {
        for (uint i = 0; i < allowedBets.length; i++) {
            if (allowedBets[i] == amount) return true;
        }
        return false;
    }
    
    function recoverSigner(bytes32 ethSignedHash, bytes memory signature) internal pure returns (address) {
        require(signature.length == 65, "Invalid signature length");
        bytes32 r; bytes32 s; uint8 v;
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        return ecrecover(ethSignedHash, v, r, s);
    }
    
    function getBankroll() external view returns (uint256) {
        return funsToken.balanceOf(address(this));
    }
    
    function getRemainingGasless(address player) external view returns (uint256) {
        if (block.timestamp > lastResetTime[player] + 1 days) {
            return maxDailyGasless;
        }
        return maxDailyGasless - dailyGaslessUsed[player];
    }
}
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./cointoss.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    address TEXT PRIMARY KEY,
    nickname TEXT UNIQUE NOT NULL,
    gasless_used INTEGER DEFAULT 0,
    gasless_reset_date TEXT DEFAULT (date('now')),
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS bets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT NOT NULL,
    choice INTEGER NOT NULL,
    amount TEXT NOT NULL,
    outcome INTEGER NOT NULL,
    won INTEGER NOT NULL,
    pnl TEXT NOT NULL,
    nonce TEXT UNIQUE NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
  )`);
  
  db.run(`CREATE INDEX IF NOT EXISTS idx_bets_address ON bets(address)`);
});

const CHAIN_ID = parseInt(process.env.CHAIN_ID || '97');
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const FUNS_TOKEN_ADDRESS = process.env.FUNS_TOKEN_ADDRESS;
const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY;
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545';

if (!CONTRACT_ADDRESS || !SIGNER_PRIVATE_KEY || !RELAYER_PRIVATE_KEY) {
  console.error('❌ ERROR: Required environment variables missing');
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signerWallet = new ethers.Wallet(SIGNER_PRIVATE_KEY);
const relayerWallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, provider);

const COINTOSS_ABI = [
  {
    inputs: [
      { name: 'player', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'choice', type: 'uint8' },
      { name: 'nonce', type: 'uint256' },
      { name: 'signature', type: 'bytes' },
    ],
    name: 'placeBet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

// ERC20 토큰 ABI (잔액 조회용)
const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const cointossContract = new ethers.Contract(CONTRACT_ADDRESS, COINTOSS_ABI, relayerWallet);
const funsTokenContract = new ethers.Contract(FUNS_TOKEN_ADDRESS, ERC20_ABI, provider);

app.post('/api/nickname', (req, res) => {
  const { address, nickname } = req.body;
  
  if (!address || !nickname) {
    return res.status(400).json({ error: 'Address and nickname required' });
  }
  
  if (!ethers.isAddress(address)) {
    return res.status(400).json({ error: 'Invalid address' });
  }
  
  const normalizedAddress = address.toLowerCase();
  const trimmedNickname = nickname.trim();
  
  db.run(
    'INSERT INTO users (address, nickname, gasless_used, gasless_reset_date) VALUES (?, ?, 0, date("now"))',
    [normalizedAddress, trimmedNickname],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'Nickname or address already taken' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true, address: normalizedAddress, nickname: trimmedNickname });
    }
  );
});

app.get('/api/me', (req, res) => {
  const { address } = req.query;
  
  if (!address || !ethers.isAddress(address)) {
    return res.status(400).json({ error: 'Valid address required' });
  }
  
  const normalizedAddress = address.toLowerCase();
  
  db.get('SELECT * FROM users WHERE address = ?', [normalizedAddress], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.json({ exists: false });
    }
    
    db.all(
      `SELECT 
        COUNT(*) as plays,
        SUM(CAST(pnl AS REAL)) as total_pnl,
        SUM(CASE WHEN won = 1 THEN 1 ELSE 0 END) as wins
      FROM bets WHERE address = ?`,
      [normalizedAddress],
      (err, stats) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({
          exists: true,
          nickname: user.nickname,
          address: user.address,
          plays: stats[0].plays || 0,
          pnl: (stats[0].total_pnl || 0).toString(),
          wins: stats[0].wins || 0
        });
      }
    );
  });
});

app.get('/api/gasless/info', async (req, res) => {
  const { address } = req.query;
  
  if (!address || !ethers.isAddress(address)) {
    return res.status(400).json({ error: 'Valid address required' });
  }
  
  const normalizedAddress = address.toLowerCase();
  
  db.get('SELECT * FROM users WHERE address = ?', [normalizedAddress], (err, user) => {
    if (err || !user) {
      return res.json({
        remainingFree: 10,
        maxDaily: 10
      });
    }
    
    const today = new Date().toISOString().split('T')[0];
    const resetDate = user.gasless_reset_date;
    
    if (resetDate !== today) {
      db.run(
        'UPDATE users SET gasless_used = 0, gasless_reset_date = ? WHERE address = ?',
        [today, normalizedAddress],
        () => {
          res.json({
            remainingFree: 10,
            maxDaily: 10
          });
        }
      );
    } else {
      const remaining = Math.max(0, 10 - (user.gasless_used || 0));
      res.json({
        remainingFree: remaining,
        maxDaily: 10
      });
    }
  });
});

app.post('/api/bet', async (req, res) => {
  const { address, choice, amount } = req.body;
  
  if (!address || choice === undefined || !amount) {
    return res.status(400).json({ error: 'Address, choice, and amount required' });
  }
  
  if (!ethers.isAddress(address)) {
    return res.status(400).json({ error: 'Invalid address' });
  }
  
  const normalizedAddress = address.toLowerCase();
  
  console.log('📥 Received bet request:', { address: normalizedAddress, amount, choice });
  
  db.get('SELECT * FROM users WHERE address = ?', [normalizedAddress], async (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found. Please set a nickname first.' });
    }
    
    const today = new Date().toISOString().split('T')[0];
    const resetDate = user.gasless_reset_date || today;
    let gaslessUsed = user.gasless_used || 0;
    
    if (resetDate !== today) {
      gaslessUsed = 0;
      db.run(
        'UPDATE users SET gasless_used = 0, gasless_reset_date = ? WHERE address = ?',
        [today, normalizedAddress]
      );
    }
    
    if (gaslessUsed >= 10) {
      return res.status(429).json({ 
        error: 'Daily gasless limit reached',
        remainingFree: 0
      });
    }
    
    try {
      const amountBN = ethers.parseEther(amount.toString());
      const nonce = Math.floor(Math.random() * 1000000);
      
      const messageHash = ethers.solidityPackedKeccak256(
        ['address', 'uint256', 'uint8', 'uint256'],
        [normalizedAddress, amountBN, choice, nonce]
      );
      
      const signature = await signerWallet.signMessage(ethers.getBytes(messageHash));
      
      console.log('🚀 Sending transaction for', normalizedAddress);
      console.log('- Amount:', amount, 'FUNS');
      console.log('- Choice:', choice === 0 ? 'HEADS' : 'TAILS');
      console.log('- Nonce:', nonce);

      // 베팅 전 잔액 조회
      const balanceBefore = await funsTokenContract.balanceOf(normalizedAddress);
      console.log('💰 Balance BEFORE:', ethers.formatEther(balanceBefore), 'FUNS');
      
      const tx = await cointossContract.placeBet(
        normalizedAddress,
        amountBN,
        choice,
        nonce,
        signature,
        { gasLimit: 500000 }
      );
      
      console.log('⏳ Waiting for confirmation...', tx.hash);
      
      const receipt = await tx.wait();
      
      console.log('✅ Transaction confirmed!', receipt.hash);

      // ⏳ RPC 캐싱 방지: 블록 확정 후 잔액이 반드시 업데이트될 때까지 대기
      console.log('⏳ Waiting 3s for RPC to sync...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 베팅 후 잔액 조회 → 실제 잔액 변화로 승패 판정
      const balanceAfter = await funsTokenContract.balanceOf(normalizedAddress);
      console.log('💰 Balance AFTER:', ethers.formatEther(balanceAfter), 'FUNS');

      const won = balanceAfter > balanceBefore;
      console.log('🎲 Result:', won ? 'WON ✅' : 'LOST ❌');
      console.log('📊 Diff:', ethers.formatEther(balanceAfter - balanceBefore), 'FUNS');
      
      const pnl = won ? amountBN : -amountBN;
      const outcome = choice;
      
      // Gasless 카운터 증가
      db.run(
        'UPDATE users SET gasless_used = gasless_used + 1 WHERE address = ?',
        [normalizedAddress]
      );
      
      // 베팅 기록 저장
      db.run(
        'INSERT INTO bets (address, choice, amount, outcome, won, pnl, nonce) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [normalizedAddress, choice, amountBN.toString(), outcome, won ? 1 : 0, pnl.toString(), nonce.toString()],
        (err) => {
          if (err) {
            console.error('DB error:', err);
          }
        }
      );
      
      console.log('📤 Responding: amount=', amount, 'won=', won);
      
      res.json({
        success: true,
        won,
        outcome,
        amount: amount,
        txHash: receipt.hash,
        gasless: true,
        remainingFree: 10 - gaslessUsed - 1
      });
      
    } catch (error) {
      console.error('Bet error:', error);
      res.status(500).json({ error: 'Transaction failed: ' + error.message });
    }
  });
});

app.get('/api/leaderboard', (req, res) => {
  const { sort = 'pnl' } = req.query;
  
  const orderBy = sort === 'plays' 
    ? 'plays DESC, total_pnl DESC' 
    : 'total_pnl DESC, plays DESC';
  
  db.all(
    `SELECT 
      u.nickname,
      u.address,
      COUNT(b.id) as plays,
      COALESCE(SUM(CAST(b.pnl AS REAL)), 0) as total_pnl,
      SUM(CASE WHEN b.won = 1 THEN 1 ELSE 0 END) as wins
    FROM users u
    LEFT JOIN bets b ON u.address = b.address
    GROUP BY u.address
    ORDER BY ${orderBy}
    LIMIT 100`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      const leaderboard = rows.map(row => ({
        nickname: row.nickname,
        address: row.address,
        plays: row.plays || 0,
        pnl: row.total_pnl.toString(),
        wins: row.wins || 0,
        winRate: row.plays > 0 ? ((row.wins / row.plays) * 100).toFixed(1) : '0.0'
      }));
      
      res.json({ leaderboard });
    }
  );
});

// Admin: 베팅 기록만 초기화 (닉네임 유지)
app.post('/api/admin/reset-bets', (req, res) => {
  const { secretKey } = req.body;
  
  if (secretKey !== 'RESET_MY_GAME_2026') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  db.run('DELETE FROM bets', (err) => {
    if (err) {
      console.error('Reset error:', err);
      return res.status(500).json({ error: 'Failed to reset bets' });
    }
    
    console.log('✅ All bets have been reset!');
    res.json({ success: true, message: 'All betting records have been reset' });
  });
});

// Admin: 모든 데이터 완전 초기화 (사용자 + 베팅)
app.post('/api/admin/reset-all', (req, res) => {
  const { secretKey } = req.body;
  
  if (secretKey !== 'RESET_MY_GAME_2026') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  db.run('DELETE FROM bets', (err1) => {
    if (err1) {
      console.error('Reset bets error:', err1);
      return res.status(500).json({ error: 'Failed to reset' });
    }
    
    db.run('DELETE FROM users', (err2) => {
      if (err2) {
        console.error('Reset users error:', err2);
        return res.status(500).json({ error: 'Failed to reset' });
      }
      
      console.log('✅ All data has been reset!');
      res.json({ success: true, message: 'All data has been reset' });
    });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`⛽ Gasless transactions: ENABLED`);
  console.log(`💰 Relayer address: ${relayerWallet.address}`);
  console.log(`🪙 FUNS Token: ${FUNS_TOKEN_ADDRESS}`);
});
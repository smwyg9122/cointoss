'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, useDisconnect } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { API_BASE_URL, CONTRACTS } from '@/config/wagmi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BankrollDisplay from '@/components/BankrollDisplay'
import CoinFlip from '@/components/CoinFlip'
import CoinFlickAnimation from '@/components/CoinFlickAnimation'

const BET_AMOUNTS = [1, 2, 4, 8, 16]

const ERC20_ABI = [
  { inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'approve', outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], name: 'allowance', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'account', type: 'address' }], name: 'balanceOf', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
] as const

export default function PlayPage() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const [selectedAmount, setSelectedAmount] = useState(1)
  const [selectedChoice, setSelectedChoice] = useState<0 | 1>(0)
  const [user, setUser] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)
  const [approving, setApproving] = useState(false)
  const [betting, setBetting] = useState(false)
  const [gaslessInfo, setGaslessInfo] = useState<any>(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [betCount, setBetCount] = useState(0)
  const [animationDone, setAnimationDone] = useState(false)

  const { writeContract: approveWrite, data: approveHash } = useWriteContract()
  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash })

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.FUNS_TOKEN,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.COINTOSS] : undefined,
  })

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.FUNS_TOKEN,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  useEffect(() => {
    if (animationDone && lastResult) {
      setIsFlipping(false)
      setShowResult(true)
    }
  }, [animationDone, lastResult])

  useEffect(() => {
    if (address) {
      fetchUser()
      fetchGaslessInfo()
    }
  }, [address])

  useEffect(() => {
    if (approveSuccess) {
      refetchAllowance()
      setApproving(false)
    }
  }, [approveSuccess])

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/me?address=${address}`)
      const data = await res.json()
      setUser(data)
    } catch (err) {
      console.error('Error fetching user:', err)
    }
  }

  const fetchGaslessInfo = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/gasless/info?address=${address}`)
      const data = await res.json()
      setGaslessInfo(data)
    } catch (err) {
      console.error('Error fetching gasless info:', err)
    }
  }

  const handleApprove = async () => {
    setApproving(true)
    try {
      approveWrite({
        address: CONTRACTS.FUNS_TOKEN,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACTS.COINTOSS, parseEther('1000000')],
      })
    } catch (err) {
      console.error('Approve error:', err)
      setApproving(false)
    }
  }

  const handleBet = async () => {
    setShowResult(false)
    setLastResult(null)
    setAnimationDone(false)
    setBetCount(prev => prev + 1)

    const currentAmount = selectedAmount
    const currentChoice = selectedChoice
    console.log('📤 Sending bet:', { amount: currentAmount, choice: currentChoice })

    setBetting(true)
    setIsFlipping(true)
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/bet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          amount: currentAmount,
          choice: currentChoice,
        }),
      })

      const data = await res.json()
      console.log('📥 Received result:', data)

      if (!res.ok) {
        setIsFlipping(false)
        setAnimationDone(false)
        throw new Error(data.error || 'Bet failed')
      }

      setLastResult(data)
      fetchUser()
      fetchGaslessInfo()
      refetchBalance()
    } catch (err: any) {
      console.error('Bet error:', err)
      setIsFlipping(false)
      alert(err.message)
    } finally {
      setBetting(false)
    }
  }

  const needsApproval = !allowance || allowance < parseEther(selectedAmount.toString())

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-3 sm:p-4">
      <CoinFlickAnimation />
      
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">🪙 Coin Toss</h1>
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-center">
            {address && (
              <div className="text-white font-mono text-xs sm:text-sm bg-white/10 px-3 sm:px-4 py-2 rounded-lg">
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            )}
            <Link href="/leaderboard" className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-xl transition-all text-sm sm:text-base whitespace-nowrap">
              🏆 Leaderboard
            </Link>
            <button
              onClick={() => disconnect()}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-xl transition-all text-sm sm:text-base whitespace-nowrap"
            >
              Disconnect
            </button>
          </div>
        </div>

        {/* 상단 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-8">
          <BankrollDisplay />
          
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border-2 border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-300 mb-1">⛽ Gas Fee Status</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-400">FREE! 🎁</p>
                <p className="text-xs text-gray-400 mt-1">
                  {gaslessInfo?.remainingFree || 0} / {gaslessInfo?.maxDaily || 10} free bets today
                </p>
              </div>
              <div className="text-4xl sm:text-5xl">🆓</div>
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm text-gray-300 mb-2">Nickname</h3>
            <p className="text-lg sm:text-2xl font-bold text-white truncate">{user?.nickname || '---'}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm text-gray-300 mb-2">Total Plays</h3>
            <p className="text-lg sm:text-2xl font-bold text-white">{user?.plays || 0}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 col-span-2 md:col-span-1">
            <h3 className="text-xs sm:text-sm text-gray-300 mb-2">Total PnL</h3>
            <p className={`text-lg sm:text-2xl font-bold ${parseFloat(user?.pnl || '0') >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {user?.pnl ? (parseFloat(formatEther(BigInt(user.pnl))) >= 0 ? '+' : '') + parseFloat(formatEther(BigInt(user.pnl))).toFixed(2) : '0'} FUNS
            </p>
          </div>
        </div>

        {/* 베팅 UI */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-8 max-w-2xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-white text-base sm:text-lg font-semibold mb-2 sm:mb-3">Your Balance</h3>
            <p className="text-2xl sm:text-3xl font-bold text-white">{balance ? parseFloat(formatEther(balance)).toFixed(2) : '0'} FUNS</p>
          </div>

          <div className="mb-4 sm:mb-6">
            <h3 className="text-white text-base sm:text-lg font-semibold mb-2 sm:mb-3">Select Bet Amount</h3>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {BET_AMOUNTS.map((amount) => (
                <button key={amount} onClick={() => setSelectedAmount(amount)} className={`py-3 sm:py-4 px-2 sm:px-4 rounded-xl font-bold transition-all text-sm sm:text-base ${selectedAmount === amount ? 'bg-purple-600 text-white scale-105' : 'bg-white/20 text-white hover:bg-white/30 active:scale-95'}`}>
                  {amount}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h3 className="text-white text-base sm:text-lg font-semibold mb-2 sm:mb-3">Choose Side</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button onClick={() => setSelectedChoice(0)} className={`py-6 sm:py-8 rounded-xl font-bold text-xl sm:text-2xl transition-all ${selectedChoice === 0 ? 'bg-blue-600 text-white scale-105' : 'bg-white/20 text-white hover:bg-white/30 active:scale-95'}`}>
                👑 HEADS
              </button>
              <button onClick={() => setSelectedChoice(1)} className={`py-6 sm:py-8 rounded-xl font-bold text-xl sm:text-2xl transition-all ${selectedChoice === 1 ? 'bg-green-600 text-white scale-105' : 'bg-white/20 text-white hover:bg-white/30 active:scale-95'}`}>
                🦅 TAILS
              </button>
            </div>
          </div>

          {needsApproval ? (
            <button onClick={handleApprove} disabled={approving} className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-bold text-lg sm:text-xl py-5 sm:py-6 rounded-xl transition-all active:scale-95">
              {approving ? 'Approving...' : 'Approve FUNS'}
            </button>
          ) : (
            <button onClick={handleBet} disabled={betting || gaslessInfo?.remainingFree === 0} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-lg sm:text-xl py-5 sm:py-6 rounded-xl transition-all transform active:scale-95">
              {betting ? 'Placing Bet...' : `🆓 Place Bet: ${selectedAmount} FUNS (FREE GAS)`}
            </button>
          )}

          {gaslessInfo?.remainingFree === 0 && (
            <p className="text-center text-yellow-400 text-sm mt-4">
              ⚠️ Daily free gas limit reached. Come back tomorrow!
            </p>
          )}
        </div>
      </div>

      {isFlipping && (
        <CoinFlip
          key={betCount}
          isFlipping={isFlipping}
          result={lastResult?.outcome === 0 ? 'heads' : 'tails'}
          onComplete={() => setAnimationDone(true)}
        />
      )}

      {showResult && lastResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl ${lastResult.won ? 'bg-gradient-to-br from-green-600 to-emerald-600' : 'bg-gradient-to-br from-red-600 to-pink-600'}`}>
            <div className="text-center">
              <div className="text-6xl sm:text-8xl mb-4">{lastResult.won ? '🎉' : '😢'}</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{lastResult.won ? 'YOU WON!' : 'YOU LOST'}</h2>
              <div className="text-5xl sm:text-6xl mb-4">{lastResult.outcome === 0 ? '👑' : '🦅'}</div>
              <p className="text-xl sm:text-2xl text-white mb-4">{lastResult.won ? `+${lastResult.amount} FUNS` : `-${lastResult.amount} FUNS`}</p>
              {lastResult.gasless && (
                <p className="text-base sm:text-lg text-white/80 mb-4">⛽ Gas fee: FREE 🎁</p>
              )}
              <button onClick={() => setShowResult(false)} className="bg-white text-gray-900 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition-all active:scale-95">
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

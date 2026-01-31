'use client'

import { useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { CONTRACTS } from '@/config/wagmi'

const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export default function BankrollDisplay() {
  const { data: balance, isLoading } = useReadContract({
    address: CONTRACTS.FUNS_TOKEN,  // 토큰 컨트랙트
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [CONTRACTS.COINTOSS],  // 게임 컨트랙트의 잔액 조회
  })

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-yellow-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300 mb-1">🏦 Prize Pool</p>
            <p className="text-2xl font-bold text-yellow-400">Loading...</p>
          </div>
          <div className="text-5xl">💰</div>
        </div>
      </div>
    )
  }

  const prizePool = balance ? parseFloat(formatEther(balance)) : 0

  return (
    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-yellow-500/30 hover:border-yellow-400/50 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300 mb-1">🏦 Total Prize Pool</p>
          <p className="text-3xl font-bold text-yellow-400">
            {prizePool.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} FUNS
          </p>
          <p className="text-xs text-gray-400 mt-1">Available for winners</p>
        </div>
        <div className="text-5xl animate-pulse">💰</div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((prizePool / 100000) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1 text-right">
          {((prizePool / 100000) * 100).toFixed(1)}% of target
        </p>
      </div>
    </div>
  )
}
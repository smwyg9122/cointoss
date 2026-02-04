'use client'

import { useState, useEffect } from 'react'
import { formatEther } from 'viem'
import { API_BASE_URL } from '@/config/wagmi'
import Link from 'next/link'

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [sortBy, setSortBy] = useState<'pnl' | 'plays'>('pnl')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [sortBy])

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/leaderboard?sort=${sortBy}`)
      const data = await res.json()
      setLeaderboard(data.leaderboard || [])
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-3 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">🏆 Leaderboard</h1>
          <Link href="/play" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-xl transition-all text-sm sm:text-base whitespace-nowrap">
            ← Back to Game
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex gap-2 sm:gap-4">
            <button onClick={() => setSortBy('pnl')} className={`flex-1 py-2 sm:py-3 px-3 sm:px-6 rounded-xl font-semibold transition-all text-sm sm:text-base ${sortBy === 'pnl' ? 'bg-purple-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}>
              Sort by PnL
            </button>
            <button onClick={() => setSortBy('plays')} className={`flex-1 py-2 sm:py-3 px-3 sm:px-6 rounded-xl font-semibold transition-all text-sm sm:text-base ${sortBy === 'plays' ? 'bg-purple-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}>
              Sort by Plays
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-white text-lg sm:text-xl py-12">Loading...</div>
        ) : (
          <>
            {/* 모바일: 카드 레이아웃 */}
            <div className="block md:hidden space-y-3">
              {leaderboard.map((player, index) => {
                const pnl = parseFloat(formatEther(BigInt(player.pnl)))
                return (
                  <div key={player.address} className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</span>
                        <div>
                          <p className="text-white font-bold text-lg">{player.nickname}</p>
                          <p className="text-gray-400 font-mono text-xs">{player.address.slice(0, 6)}...{player.address.slice(-4)}</p>
                        </div>
                      </div>
                      <div className={`font-bold text-lg ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-400">Plays</p>
                        <p className="text-white font-semibold">{player.plays}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Wins</p>
                        <p className="text-white font-semibold">{player.wins}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Win Rate</p>
                        <p className="text-white font-semibold">{player.winRate}%</p>
                      </div>
                    </div>
                  </div>
                )
              })}
              {leaderboard.length === 0 && (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center text-gray-400">
                  No players yet. Be the first!
                </div>
              )}
            </div>

            {/* 데스크톱: 테이블 레이아웃 */}
            <div className="hidden md:block bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nickname</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Address</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-white">Plays</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-white">Wins</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-white">Win Rate</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-white">PnL (FUNS)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((player, index) => {
                      const pnl = parseFloat(formatEther(BigInt(player.pnl)))
                      return (
                        <tr key={player.address} className="border-t border-white/10 hover:bg-white/5">
                          <td className="px-6 py-4">
                            <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</span>
                          </td>
                          <td className="px-6 py-4 text-white font-semibold">{player.nickname}</td>
                          <td className="px-6 py-4 text-gray-300 font-mono text-sm">{player.address.slice(0, 6)}...{player.address.slice(-4)}</td>
                          <td className="px-6 py-4 text-right text-white">{player.plays}</td>
                          <td className="px-6 py-4 text-right text-white">{player.wins}</td>
                          <td className="px-6 py-4 text-right text-white">{player.winRate}%</td>
                          <td className={`px-6 py-4 text-right font-bold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                          </td>
                        </tr>
                      )
                    })}
                    {leaderboard.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-400">No players yet. Be the first!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

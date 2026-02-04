'use client'

import { useState, useEffect } from 'react'
import { formatEther } from 'viem'
import { API_BASE_URL } from '@/config/wagmi'
import Link from 'next/link'
import { useAccount } from 'wagmi'

export default function LeaderboardPage() {
  const { address } = useAccount()
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [sortBy, setSortBy] = useState<'pnl' | 'plays'>('pnl')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [myRank, setMyRank] = useState<any>(null)

  const ITEMS_PER_PAGE = 10
  const MAX_PAGES = 5

  useEffect(() => {
    fetchLeaderboard()
  }, [sortBy])

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/leaderboard?sort=${sortBy}`)
      const data = await res.json()
      const allPlayers = data.leaderboard || []
      
      setLeaderboard(allPlayers)
      
      // ✅ 4번: 현재 사용자의 순위 찾기
      if (address) {
        const normalizedAddress = address.toLowerCase()
        const userIndex = allPlayers.findIndex((p: any) => p.address.toLowerCase() === normalizedAddress)
        if (userIndex !== -1) {
          setMyRank({
            ...allPlayers[userIndex],
            rank: userIndex + 1
          })
        } else {
          setMyRank(null)
        }
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
    } finally {
      setLoading(false)
    }
  }

  // ✅ 5번: 페이지네이션 - 50위까지만 표시
  const displayedLeaderboard = leaderboard.slice(0, 50)
  const totalPages = Math.min(Math.ceil(displayedLeaderboard.length / ITEMS_PER_PAGE), MAX_PAGES)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentPageData = displayedLeaderboard.slice(startIndex, endIndex)

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
            {/* ✅ 4번: 본인 순위 카드 (상단 고정) */}
            {myRank && (
              <div className="bg-gradient-to-r from-yellow-500/30 to-amber-500/30 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-4 border-2 border-yellow-500">
                <p className="text-yellow-300 text-sm font-semibold mb-3">YOUR RANK</p>
                <div className="block md:hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">#{myRank.rank}</span>
                      <div>
                        <p className="text-white font-bold text-xl">{myRank.nickname}</p>
                        <p className="text-gray-300 font-mono text-xs">{myRank.address.slice(0, 6)}...{myRank.address.slice(-4)}</p>
                      </div>
                    </div>
                    <div className={`font-bold text-xl ${parseFloat(formatEther(BigInt(myRank.pnl))) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {/* ✅ 3번: Plays 모드일 때 Total Plays 표시 */}
                      {sortBy === 'plays' ? myRank.plays : (parseFloat(formatEther(BigInt(myRank.pnl))) >= 0 ? '+' : '') + parseFloat(formatEther(BigInt(myRank.pnl))).toFixed(2)}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-gray-300">Plays</p>
                      <p className="text-white font-semibold">{myRank.plays}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-300">Wins</p>
                      <p className="text-white font-semibold">{myRank.wins}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-300">Win Rate</p>
                      <p className="text-white font-semibold">{myRank.winRate}%</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <span className="text-4xl">#{myRank.rank}</span>
                    <div>
                      <p className="text-white font-bold text-xl">{myRank.nickname}</p>
                      <p className="text-gray-300 font-mono text-sm">{myRank.address.slice(0, 6)}...{myRank.address.slice(-4)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-xs text-gray-300">Plays</p>
                      <p className="text-white font-semibold text-lg">{myRank.plays}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-300">Wins</p>
                      <p className="text-white font-semibold text-lg">{myRank.wins}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-300">Win Rate</p>
                      <p className="text-white font-semibold text-lg">{myRank.winRate}%</p>
                    </div>
                    <div className={`font-bold text-2xl ${parseFloat(formatEther(BigInt(myRank.pnl))) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {sortBy === 'plays' ? `${myRank.plays} plays` : (parseFloat(formatEther(BigInt(myRank.pnl))) >= 0 ? '+' : '') + parseFloat(formatEther(BigInt(myRank.pnl))).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 모바일: 카드 레이아웃 */}
            <div className="block md:hidden space-y-3">
              {currentPageData.map((player, index) => {
                const globalIndex = startIndex + index
                const pnl = parseFloat(formatEther(BigInt(player.pnl)))
                return (
                  <div key={player.address} className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{globalIndex === 0 ? '🥇' : globalIndex === 1 ? '🥈' : globalIndex === 2 ? '🥉' : `#${globalIndex + 1}`}</span>
                        <div>
                          <p className="text-white font-bold text-lg">{player.nickname}</p>
                          <p className="text-gray-400 font-mono text-xs">{player.address.slice(0, 6)}...{player.address.slice(-4)}</p>
                        </div>
                      </div>
                      <div className={`font-bold text-lg ${sortBy === 'plays' ? 'text-blue-400' : pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {/* ✅ 3번 수정 */}
                        {sortBy === 'plays' ? player.plays : (pnl >= 0 ? '+' : '') + pnl.toFixed(2)}
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
            </div>

            {/* 데스크톱: 테이블 레이아웃 */}
            <div className="hidden md:block bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden mb-6">
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
                      {/* ✅ 3번 수정: 컬럼 헤더 */}
                      <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                        {sortBy === 'plays' ? 'Total Plays' : 'PnL (FUNS)'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPageData.map((player, index) => {
                      const globalIndex = startIndex + index
                      const pnl = parseFloat(formatEther(BigInt(player.pnl)))
                      return (
                        <tr key={player.address} className="border-t border-white/10 hover:bg-white/5">
                          <td className="px-6 py-4">
                            <span className="text-2xl">{globalIndex === 0 ? '🥇' : globalIndex === 1 ? '🥈' : globalIndex === 2 ? '🥉' : `#${globalIndex + 1}`}</span>
                          </td>
                          <td className="px-6 py-4 text-white font-semibold">{player.nickname}</td>
                          <td className="px-6 py-4 text-gray-300 font-mono text-sm">{player.address.slice(0, 6)}...{player.address.slice(-4)}</td>
                          <td className="px-6 py-4 text-right text-white">{player.plays}</td>
                          <td className="px-6 py-4 text-right text-white">{player.wins}</td>
                          <td className="px-6 py-4 text-right text-white">{player.winRate}%</td>
                          {/* ✅ 3번 수정: 데이터 표시 */}
                          <td className={`px-6 py-4 text-right font-bold ${sortBy === 'plays' ? 'text-blue-400' : pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {sortBy === 'plays' ? player.plays : (pnl >= 0 ? '+' : '') + pnl.toFixed(2)}
                          </td>
                        </tr>
                      )
                    })}
                    {currentPageData.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-400">No players yet. Be the first!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ✅ 5번: 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-all"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-all ${currentPage === page ? 'bg-purple-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

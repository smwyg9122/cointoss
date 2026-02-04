'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useRouter } from 'next/navigation'
import { API_BASE_URL } from '@/config/wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const [showNicknameModal, setShowNicknameModal] = useState(false)
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isConnected && address && mounted) {
      checkUser()
    }
  }, [isConnected, address, mounted])

  const checkUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/me?address=${address}`)
      const data = await res.json()
      
      if (data.exists) {
        router.push('/play')
      } else {
        setShowNicknameModal(true)
      }
    } catch (err) {
      console.error('Error checking user:', err)
    }
  }

  const handleCreateNickname = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE_URL}/api/nickname`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, nickname }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create nickname')
      }

      router.push('/play')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-3 sm:mb-4">🪙</h1>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Coin Toss</h2>
          <p className="text-base sm:text-lg text-gray-300">Win 2x your bet</p>
        </div>

        {!isConnected ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 text-center">
              Connect Your Wallet
            </h3>
            <div className="space-y-3">
              {connectors.map((connector) => {
                let buttonName = connector.name;
                
                if (connector.name === 'Injected') {
                  buttonName = 'OKX Wallet';
                } else if (connector.name === 'WalletConnect') {
                  buttonName = 'WalletConnect (토큰포켓)';
                }
                
                return (
                  <button
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform active:scale-95 text-base sm:text-lg"
                  >
                    {buttonName}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-2xl">
            <p className="text-sm text-gray-300 mb-3 sm:mb-4">Connected:</p>
            <p className="text-white font-mono text-xs sm:text-sm mb-5 sm:mb-6 break-all">{address}</p>
            <button
              onClick={() => disconnect()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all active:scale-95 text-base"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {showNicknameModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Choose Your Nickname</h3>
            <form onSubmit={handleCreateNickname}>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter nickname (3-20 chars)"
                className="w-full bg-white/20 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 mb-4 focus:outline-none focus:border-purple-400 text-base"
                minLength={3}
                maxLength={20}
                required
              />
              {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all active:scale-95 text-base"
              >
                {loading ? 'Creating...' : 'Create Nickname'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

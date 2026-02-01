'use client'

import { useState, useEffect } from 'react'

interface CoinFlipProps {
  isFlipping: boolean
  result: 'heads' | 'tails' | null
  onComplete?: () => void
}

export default function CoinFlip({ isFlipping, result, onComplete }: CoinFlipProps) {
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (isFlipping) {
      setShowResult(false)
      // 2초 후 결과 표시
      const timer = setTimeout(() => {
        setShowResult(true)
        if (onComplete) {
          setTimeout(onComplete, 500)
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isFlipping, onComplete])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative">
        {/* 동전 */}
        <div
          className={`w-64 h-64 relative preserve-3d ${
            isFlipping ? 'animate-coin-flip' : ''
          } ${showResult && result === 'tails' ? 'rotate-y-180' : ''}`}
          style={{
            transformStyle: 'preserve-3d',
            transition: showResult ? 'transform 0.6s' : 'none',
          }}
        >
          {/* 앞면 - HEADS (스마일) */}
          <div
            className="absolute inset-0 backface-hidden rounded-full shadow-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              border: '8px solid #FF6B00',
              backfaceVisibility: 'hidden',
            }}
          >
            <div className="text-8xl">😊</div>
          </div>

          {/* 뒷면 - TAILS (FUNS) */}
          <div
            className="absolute inset-0 backface-hidden rounded-full shadow-2xl flex items-center justify-center rotate-y-180"
            style={{
              background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
              border: '8px solid #2E5C8A',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="text-6xl font-bold text-white">FUNS</div>
          </div>
        </div>

        {/* 빛나는 효과 */}
        {isFlipping && (
          <div className="absolute inset-0 rounded-full animate-pulse">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 opacity-50 blur-xl"></div>
          </div>
        )}
      </div>
    </div>
  )
}
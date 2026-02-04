'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

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
      const timer = setTimeout(() => {
        setShowResult(true)
        if (onComplete) {
          setTimeout(onComplete, 0)
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isFlipping, onComplete])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative">
        {/* 동전 - 모바일/데스크톱 반응형 크기 */}
        <div
          className={`w-64 h-64 sm:w-80 sm:h-80 relative ${
            isFlipping ? 'animate-coin-flip' : ''
          } ${showResult && result === 'tails' ? 'rotate-y-180' : ''}`}
          style={{
            transformStyle: 'preserve-3d',
            transition: showResult ? 'transform 0.6s' : 'none',
          }}
        >
          {/* 앞면 - HEADS */}
          <div
            className="absolute inset-0 rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
            }}
          >
            <Image
              src="/coin-heads.png"
              alt="Heads"
              width={320}
              height={320}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* 뒷면 - TAILS */}
          <div
            className="absolute inset-0 rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <Image
              src="/coin-tails.png"
              alt="Tails"
              width={320}
              height={320}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>

        {/* 빛나는 효과 */}
        {isFlipping && (
          <div className="absolute inset-0 rounded-full animate-pulse">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-500 opacity-50 blur-2xl"></div>
          </div>
        )}
      </div>
    </div>
  )
}

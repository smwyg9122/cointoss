'use client'

import { useEffect, useState } from 'react'

export default function CoinFlickAnimation() {
  const [show, setShow] = useState(true)

  return (
    <>
      {/* 왼쪽 손가락 */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="relative">
          {/* 동전들 */}
          <div className="coin-flick-left">
            <div className="text-6xl animate-flick-coin-1">🪙</div>
          </div>
          <div className="coin-flick-left delay-1">
            <div className="text-5xl animate-flick-coin-2">🪙</div>
          </div>
          <div className="coin-flick-left delay-2">
            <div className="text-4xl animate-flick-coin-3">🪙</div>
          </div>
          
          {/* 손가락 */}
          <div className="text-8xl animate-flick-hand-left mt-4">
            👆
          </div>
        </div>
      </div>

      {/* 오른쪽 손가락 */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="relative">
          {/* 동전들 */}
          <div className="coin-flick-right">
            <div className="text-6xl animate-flick-coin-1">🪙</div>
          </div>
          <div className="coin-flick-right delay-1">
            <div className="text-5xl animate-flick-coin-2">🪙</div>
          </div>
          <div className="coin-flick-right delay-2">
            <div className="text-4xl animate-flick-coin-3">🪙</div>
          </div>
          
          {/* 손가락 */}
          <div className="text-8xl animate-flick-hand-right mt-4 scale-x-[-1]">
            👆
          </div>
        </div>
      </div>

      <style jsx>{`
        .coin-flick-left,
        .coin-flick-right {
          position: absolute;
          bottom: 100px;
        }

        .coin-flick-left.delay-1 {
          animation-delay: 0.3s;
        }

        .coin-flick-left.delay-2 {
          animation-delay: 0.6s;
        }

        .coin-flick-right.delay-1 {
          animation-delay: 0.3s;
        }

        .coin-flick-right.delay-2 {
          animation-delay: 0.6s;
        }
      `}</style>
    </>
  )
}
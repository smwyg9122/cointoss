'use client'

export default function CoinFlickAnimation() {
  return (
    <>
      {/* 왼쪽 손가락 - 베팅 창 옆 */}
      <div className="fixed left-4 md:left-8 bottom-[15%] md:bottom-[20%] pointer-events-none z-10">
        <div className="relative">
          {/* 동전들 */}
          <div className="absolute bottom-20">
            <div className="text-4xl md:text-6xl animate-flick-coin-1">🪙</div>
          </div>
          <div className="absolute bottom-20" style={{ animationDelay: '0.3s' }}>
            <div className="text-3xl md:text-5xl animate-flick-coin-2">🪙</div>
          </div>
          <div className="absolute bottom-20" style={{ animationDelay: '0.6s' }}>
            <div className="text-2xl md:text-4xl animate-flick-coin-3">🪙</div>
          </div>
          
          {/* 손가락 */}
          <div className="text-6xl md:text-8xl animate-flick-hand-left">
            👆
          </div>
        </div>
      </div>

      {/* 오른쪽 손가락 - 베팅 창 옆 */}
      <div className="fixed right-4 md:right-8 bottom-[15%] md:bottom-[20%] pointer-events-none z-10">
        <div className="relative">
          {/* 동전들 */}
          <div className="absolute bottom-20">
            <div className="text-4xl md:text-6xl animate-flick-coin-1">🪙</div>
          </div>
          <div className="absolute bottom-20" style={{ animationDelay: '0.3s' }}>
            <div className="text-3xl md:text-5xl animate-flick-coin-2">🪙</div>
          </div>
          <div className="absolute bottom-20" style={{ animationDelay: '0.6s' }}>
            <div className="text-2xl md:text-4xl animate-flick-coin-3">🪙</div>
          </div>
          
          {/* 손가락 (좌우 반전) */}
          <div className="text-6xl md:text-8xl animate-flick-hand-right scale-x-[-1]">
            👆
          </div>
        </div>
      </div>
    </>
  )
}
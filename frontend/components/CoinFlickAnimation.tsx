'use client'

import Image from 'next/image'

export default function CoinFlickAnimation() {
  return (
    <>
      {/* ✅ 4번 수정: 왼쪽 손가락 → 더 중앙으로 이동 */}
      <div className="hidden sm:block fixed left-16 md:left-24 lg:left-32 bottom-[10%] md:bottom-[15%] pointer-events-none z-10">
        <div className="relative w-28 h-40 md:w-40 md:h-52">
          {/* 동전 1 */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-24 md:bottom-32 animate-flick-coin-shot">
            <Image
              src="/FUNS_back_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-10 h-10 md:w-14 md:h-14 object-contain"
            />
          </div>

          {/* 동전 2 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-24 md:bottom-32 animate-flick-coin-shot"
            style={{ animationDelay: '0.4s' }}
          >
            <Image
              src="/FUNS_front_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-8 h-8 md:w-12 md:h-12 object-contain"
            />
          </div>

          {/* 동전 3 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-24 md:bottom-32 animate-flick-coin-shot"
            style={{ animationDelay: '0.8s' }}
          >
            <Image
              src="/FUNS_back_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-7 h-7 md:w-10 md:h-10 object-contain"
            />
          </div>

          {/* 왼쪽 손 GIF */}
          <div className="absolute bottom-0 left-0">
            <img
              src="/hand_flick_left.gif"
              alt="hand flick"
              className="w-28 h-28 md:w-36 md:h-36 object-contain"
            />
          </div>
        </div>
      </div>

      {/* ✅ 4번 수정: 오른쪽 손가락 → 더 중앙으로 이동 */}
      <div className="hidden sm:block fixed right-16 md:right-24 lg:right-32 bottom-[10%] md:bottom-[15%] pointer-events-none z-10">
        <div className="relative w-28 h-40 md:w-40 md:h-52">
          {/* 동전 1 */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-24 md:bottom-32 animate-flick-coin-shot">
            <Image
              src="/FUNS_front_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-10 h-10 md:w-14 md:h-14 object-contain"
            />
          </div>

          {/* 동전 2 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-24 md:bottom-32 animate-flick-coin-shot"
            style={{ animationDelay: '0.4s' }}
          >
            <Image
              src="/FUNS_back_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-8 h-8 md:w-12 md:h-12 object-contain"
            />
          </div>

          {/* 동전 3 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-24 md:bottom-32 animate-flick-coin-shot"
            style={{ animationDelay: '0.8s' }}
          >
            <Image
              src="/FUNS_front_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-7 h-7 md:w-10 md:h-10 object-contain"
            />
          </div>

          {/* 오른쪽 손 GIF */}
          <div className="absolute bottom-0 right-0">
            <img
              src="/hand_flick_right.gif"
              alt="hand flick"
              className="w-28 h-28 md:w-36 md:h-36 object-contain"
            />
          </div>
        </div>
      </div>
    </>
  )
}

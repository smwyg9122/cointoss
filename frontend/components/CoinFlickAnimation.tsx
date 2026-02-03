'use client'

import Image from 'next/image'

export default function CoinFlickAnimation() {
  return (
    <>
      {/* 왼쪽 손가락 튕기기 */}
      <div className="fixed left-2 md:left-6 bottom-[12%] md:bottom-[18%] pointer-events-none z-10">
        <div className="relative w-40 h-52">
          {/* 동전 1 */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-32 animate-flick-coin-shot">
            <Image
              src="/FUNS_back_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-14 h-14 md:w-18 md:h-18 object-contain"
            />
          </div>

          {/* 동전 2 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-32 animate-flick-coin-shot"
            style={{ animationDelay: '0.4s' }}
          >
            <Image
              src="/FUNS_front_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
          </div>

          {/* 동전 3 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-32 animate-flick-coin-shot"
            style={{ animationDelay: '0.8s' }}
          >
            <Image
              src="/FUNS_back_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-10 h-10 md:w-14 md:h-14 object-contain"
            />
          </div>

          {/* 왼쪽 손 GIF (엄지 튕기기) */}
          <div className="absolute bottom-0 left-0">
            <img
              src="/hand_flick_left.gif"
              alt="hand flick"
              className="w-36 h-36 md:w-44 md:h-44 object-contain"
            />
          </div>
        </div>
      </div>

      {/* 오른쪽 손가락 튕기기 */}
      <div className="fixed right-2 md:right-6 bottom-[12%] md:bottom-[18%] pointer-events-none z-10">
        <div className="relative w-40 h-52">
          {/* 동전 1 */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-32 animate-flick-coin-shot">
            <Image
              src="/FUNS_front_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-14 h-14 md:w-18 md:h-18 object-contain"
            />
          </div>

          {/* 동전 2 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-32 animate-flick-coin-shot"
            style={{ animationDelay: '0.4s' }}
          >
            <Image
              src="/FUNS_back_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
          </div>

          {/* 동전 3 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-32 animate-flick-coin-shot"
            style={{ animationDelay: '0.8s' }}
          >
            <Image
              src="/FUNS_front_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-10 h-10 md:w-14 md:h-14 object-contain"
            />
          </div>

          {/* 오른쪽 손 GIF (좌우반전 버전) */}
          <div className="absolute bottom-0 right-0">
            <img
              src="/hand_flick_right.gif"
              alt="hand flick"
              className="w-36 h-36 md:w-44 md:h-44 object-contain"
            />
          </div>
        </div>
      </div>
    </>
  )
}
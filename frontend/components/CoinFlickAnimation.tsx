'use client'

import Image from 'next/image'

export default function CoinFlickAnimation() {
  return (
    <>
      {/* 왼쪽 엄지손가락 튕기기 */}
      <div className="fixed left-4 md:left-10 bottom-[15%] md:bottom-[20%] pointer-events-none z-10">
        <div className="relative w-32 h-48">
          {/* 동전 1 - FUNS 글자 */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-20 animate-flick-coin-shot">
            <Image
              src="/FUNS_back_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
          </div>

          {/* 동전 2 - FUNS 스마일 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-20 animate-flick-coin-shot"
            style={{ animationDelay: '0.4s' }}
          >
            <Image
              src="/FUNS_front_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-14 h-14 md:w-16 md:h-16 object-contain"
            />
          </div>

          {/* 동전 3 - FUNS 글자 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-20 animate-flick-coin-shot"
            style={{ animationDelay: '0.8s' }}
          >
            <Image
              src="/FUNS_back_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
            />
          </div>

          {/* 엄지손가락 튕기기 - 왼쪽 (오른쪽 방향) */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 text-7xl md:text-8xl animate-flick-finger-up"
            style={{ transformOrigin: 'bottom center' }}
          >
            👍
          </div>
        </div>
      </div>

      {/* 오른쪽 엄지손가락 튕기기 */}
      <div className="fixed right-4 md:right-10 bottom-[15%] md:bottom-[20%] pointer-events-none z-10">
        <div className="relative w-32 h-48">
          {/* 동전 1 - FUNS 스마일 */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-20 animate-flick-coin-shot">
            <Image
              src="/FUNS_front_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
          </div>

          {/* 동전 2 - FUNS 글자 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-20 animate-flick-coin-shot"
            style={{ animationDelay: '0.4s' }}
          >
            <Image
              src="/FUNS_back_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-14 h-14 md:w-16 md:h-16 object-contain"
            />
          </div>

          {/* 동전 3 - FUNS 스마일 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-20 animate-flick-coin-shot"
            style={{ animationDelay: '0.8s' }}
          >
            <Image
              src="/FUNS_front_logo.png"
              alt="FUNS"
              width={80}
              height={80}
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
            />
          </div>

          {/* 엄지손가락 튕기기 - 오른쪽 (왼쪽 방향, 좌우 반전) */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 text-7xl md:text-8xl animate-flick-finger-up scale-x-[-1]"
            style={{ transformOrigin: 'bottom center' }}
          >
            👍
          </div>
        </div>
      </div>
    </>
  )
}
'use client'

import Image from 'next/image'

export default function CoinFlickAnimation() {
  return (
    <>
      <div className="fixed left-8 md:left-16 bottom-[15%] md:bottom-[20%] pointer-events-none z-10">
        <div className="relative w-32 h-40">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-16 animate-flick-coin-shot">
            <Image
              src="/coin-heads.png"
              alt="coin"
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20"
            />
          </div>
          
          <div 
            className="absolute left-1/2 -translate-x-1/2 bottom-16 animate-flick-coin-shot"
            style={{ animationDelay: '0.4s' }}
          >
            <Image
              src="/coin-tails.png"
              alt="coin"
              width={80}
              height={80}
              className="w-14 h-14 md:w-16 md:h-16"
            />
          </div>
          
          <div 
            className="absolute left-1/2 -translate-x-1/2 bottom-16 animate-flick-coin-shot"
            style={{ animationDelay: '0.8s' }}
          >
            <Image
              src="/coin-heads.png"
              alt="coin"
              width={80}
              height={80}
              className="w-12 h-12 md:w-14 md:h-14"
            />
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 text-7xl md:text-8xl animate-flick-finger-up">
            👆
          </div>
        </div>
      </div>

      <div className="fixed right-8 md:right-16 bottom-[15%] md:bottom-[20%] pointer-events-none z-10">
        <div className="relative w-32 h-40">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-16 animate-flick-coin-shot">
            <Image
              src="/coin-tails.png"
              alt="coin"
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20"
            />
          </div>
          
          <div 
            className="absolute left-1/2 -translate-x-1/2 bottom-16 animate-flick-coin-shot"
            style={{ animationDelay: '0.4s' }}
          >
            <Image
              src="/coin-heads.png"
              alt="coin"
              width={80}
              height={80}
              className="w-14 h-14 md:w-16 md:h-16"
            />
          </div>
          
          <div 
            className="absolute left-1/2 -translate-x-1/2 bottom-16 animate-flick-coin-shot"
            style={{ animationDelay: '0.8s' }}
          >
            <Image
              src="/coin-tails.png"
              alt="coin"
              width={80}
              height={80}
              className="w-12 h-12 md:w-14 md:h-14"
            />
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 text-7xl md:text-8xl animate-flick-finger-up scale-x-[-1]">
            👆
          </div>
        </div>
      </div>
    </>
  )
}
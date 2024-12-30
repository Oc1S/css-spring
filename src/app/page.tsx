'use client'

import { animate } from 'popmotion'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    animate({
      to: 100,
      type: 'spring',
    })

  }, [])
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      1121
    </div>
  )
}


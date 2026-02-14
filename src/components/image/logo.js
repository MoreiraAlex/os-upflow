'use client'
import { useTheme } from 'next-themes'
import Image from 'next/image'

export function Logo({ width, height }) {
  const { theme } = useTheme()
  return (
    <Image
      src={theme === 'dark' ? '/darkLogo.png' : '/logo.png'}
      alt="OS Upflow"
      width={width}
      height={height}
      className="object-contain"
    />
  )
}

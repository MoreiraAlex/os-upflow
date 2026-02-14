'use client'
import { useTheme } from 'next-themes'
import Image from 'next/image'

export function Logo() {
  const { theme } = useTheme()
  return (
    <Image
      src={theme === 'dark' ? '/darkLogo.png' : '/logo.png'}
      alt="OS Upflow"
      width={200}
      height={80}
      className="object-contain"
    />
  )
}

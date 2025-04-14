import { Bricolage_Grotesque, Hanken_Grotesk } from 'next/font/google'

type TextProps = {
  size: 'small' | 'medium' | 'large'
  children: React.ReactNode
  className?: string
}

const bricolage = Bricolage_Grotesque({ subsets: ['latin'] })
const hanken = Hanken_Grotesk({ subsets: ['latin'] })

export function Text({ size, children, className }: TextProps) {

  if (size === 'small') {
    return <p className={`${hanken.className} text-base opacity-90 ${className && className}`}>{children}</p>
  }
  if (size === 'medium') {
    return <h2 className={`${bricolage.className} ${className && className}`}>{children}</h2>
  }
  return <h1 className={`${bricolage.className} text-4xl font-bold ${className && className}`}>{children}</h1>
}
import Image from "next/image"

interface AuthFormProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthForm({ children, title, subtitle }: AuthFormProps) {
  return (
    <div className="space-y-6 z-20">
      <div className="text-center">
        <Image src="/logo.svg" alt="Logo" width={100} height={100} className="mx-auto" />
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-stone-50">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}


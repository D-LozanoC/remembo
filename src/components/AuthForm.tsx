import Image from "next/image"

interface AuthFormProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthForm({ children, title, subtitle }: AuthFormProps) {
  return (
    <section className="bg-white">
      <div className="text-center flex flex-col items-center justify-center space-y-4">
        <Image src="/black-logo.png" alt="Logo" width={100} height={100} className="mx-auto text-black" />
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-black">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-black">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}


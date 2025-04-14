import { Text } from '../../atoms/Text'

interface AuthFormProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthForm({ children, title, subtitle }: AuthFormProps) {
  return (
    <div className="space-y-4 bg-blue_100 z-20">
      <div className="text-center">
        <Text size="large">{title}</Text>
        {subtitle && <Text size="small">{subtitle}</Text>}
      </div>
      {children}
    </div>
  )
}


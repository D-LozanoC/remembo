import type React from "react"
import { Hanken_Grotesk } from 'next/font/google'

const hanken = Hanken_Grotesk({ subsets: ['latin'] })

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function InputField({ label, ...props }: InputFieldProps) {
  return (
    <div>
      <input
        className={`${hanken.className} mt-1 block w-full rounded-md bg-blue_200 text-white px-4 py-3 focus:border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-200 sm:text-sm`}
        placeholder={label}
        {...props}
      />
    </div>
  )
}

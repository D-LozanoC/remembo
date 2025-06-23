import type React from "react"

import FormErrorMessage from "@/components/FormErrorMessage"
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: {
    message?: string
  }
}

export function InputField({ label, error, ...props }: InputFieldProps) {
  return (
    <div>
      <input
        className="mt-1 block w-full rounded-md border text-indigo-950 border-gray-300 px-3 py-3 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-200 sm:text-sm"
        placeholder={label}
        {...props}
      />
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </div>
  )
}


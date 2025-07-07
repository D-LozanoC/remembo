import type React from "react"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string,
  className?: string
}

export function InputField({ label, className, ...props }: InputFieldProps) {
  return (
    <div>
      <input
        className={`mt-1 block w-full rounded-md border text-indigo-950 border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-200 sm:text-sm ${className}`}
        placeholder={label}
        {...props}
      />
    </div>
  )
}


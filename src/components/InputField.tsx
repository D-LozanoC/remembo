import type React from "react"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function InputField({ label, ...props }: InputFieldProps) {
  return (
    <div>
      <input
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
        placeholder={label}
        {...props}
      />
    </div>
  )
}


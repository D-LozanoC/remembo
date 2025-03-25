interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "link" | "danger" | "ghost" | "success" | "logout"
}

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const baseStyles =
    "w-full rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"

  const variantStyles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-600",
    secondary: "bg-white text-indigo-600 border border-gray-300 hover:bg-gray-100 focus-visible:outline-indigo-600",
    link: "text-indigo-600 underline hover:text-indigo-800 focus-visible:outline-indigo-600",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
    ghost: "text-indigo-600 hover:bg-indigo-50 focus-visible:outline-indigo-600",
    success: "bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200",
    logout: "bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-normal"
  }

  return (
    <button className={`${baseStyles} ${className} ${variantStyles[variant]}`} {...props}>
      {children}
    </button>
  )
}


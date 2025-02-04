import type React from "react"

interface LayoutProps {
  children: React.ReactNode
  pattern?: boolean
}
export default function AuthLayout({ children, pattern = true }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 lg:block relative">
        {pattern && (
          <div className="absolute inset-0 bg-gradient-to-br from-teal-300 via-pink-300 to-purple-400 opacity-70">
            <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/oriental-tiles.png')] opacity-30"></div>

            <div
              className="absolute inset-0"
              style={{
                background: `
                  repeating-linear-gradient(
                    45deg,
                    rgba(255, 255, 255, 0.1) 0,
                    rgba(255, 255, 255, 0.1) 1px,
                    rgba(0, 0, 0, 0.05) 1px,
                    rgba(0, 0, 0, 0.05) 2px
                  )`,
                opacity: 0.2,
              }}
            ></div>
          </div>
        )}
      </div>
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="w-full max-w-md space-y-8 px-4 py-12 sm:px-6 lg:px-8  rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}

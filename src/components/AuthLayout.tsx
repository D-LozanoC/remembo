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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 opacity-90">
            <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/oriental-tiles.png')] opacity-10"></div>
          </div>
        )}
      </div>
      <div className="flex w-full items-center justify-center lg:w-1/2 bg-gray-50 z-20">
        <div className="w-full relative max-w-md space-y-8 px-4 py-12 sm:px-6 lg:px-8 rounded-lg shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-purple-300 rounded-lg to-pink-300 opacity-90 -z-50">
            <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/webb.png')] opacity-30"></div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

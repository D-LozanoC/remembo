import { cn } from "@/utils/cn"
import { HTMLAttributes, forwardRef } from "react"

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  )
)
CardContent.displayName = "CardContent"
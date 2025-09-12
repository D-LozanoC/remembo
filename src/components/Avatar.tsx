// components/ui/avatar.tsx
import { cn } from "@/utils/cn"
import Image from "next/image"
import { HTMLAttributes, forwardRef } from "react"

const Avatar = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
)
Avatar.displayName = "Avatar"

interface AvatarImageProps extends React.ComponentPropsWithoutRef<typeof Image> {
  className?: string
}

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, width = 72, height = 72, ...props }, ref) => (
    <Image
      ref={ref}
      className={cn(
        "aspect-square h-full w-full object-cover",
        className
      )}
      src={src || "/default-avatar.png"}
      alt={alt || "Avatar del usuario"}
      width={width}
      height={height}
      {...props}
    />
  )
)

AvatarImage.displayName = "AvatarImage"

const AvatarFallback = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  )
)
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
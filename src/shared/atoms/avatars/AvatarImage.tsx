import { cn } from "@/utils/cn"
import Image from "next/image"
import { forwardRef } from "react"

interface AvatarImageProps extends React.ComponentPropsWithoutRef<typeof Image> {
  className?: string
}

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
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
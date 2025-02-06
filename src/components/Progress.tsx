// components/ui/progress.tsx
'use client'

import * as React from 'react'
import { cn } from '@/utils/cn'

const Progress = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: number }
>(({ className, value, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'h-2 w-full overflow-hidden rounded-full bg-gray-100',
            className
        )}
        {...props}
    >
        <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${value}%` }}
        />
    </div>
))

Progress.displayName = 'Progress'

export { Progress }
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const session = useSession()
    const router = useRouter()

    useEffect(() => {
        if (!session || !session?.data?.user) {
            router.push('/auth/login')
        }
    }, [session, router])

    return <>{session ? children : null}</>
}
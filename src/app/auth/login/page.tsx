'use client'

import { Loader } from "@/shared/atoms/Loader"
import LoginForm from "@/shared/sections/auth/components/LoginForm"
import { Suspense } from "react"

export default function Login() {
    return (
        <Suspense fallback={<Loader />}>
            <LoginForm />
        </Suspense>
    )
}

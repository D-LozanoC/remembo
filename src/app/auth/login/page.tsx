'use client'

import { Loader } from "@/components/Loader"
import LoginForm from "@/components/LoginForm"
import { Suspense } from "react"

export default function Login() {
    return (
        <Suspense fallback={<Loader />}>
            <LoginForm />
        </Suspense>
    )
}

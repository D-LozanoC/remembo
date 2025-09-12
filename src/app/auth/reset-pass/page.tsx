'use client'

import { Loader } from "@/components/Loader"
import ResetPasswordForm from "@/shared/sections/auth/components/ResetPasswordForm"
import { Suspense } from "react"

export default function ResetPassword() {
    return (
        <Suspense fallback={<Loader />}>
            <ResetPasswordForm />
        </Suspense>
    )
}

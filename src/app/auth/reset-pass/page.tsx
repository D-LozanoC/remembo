'use client'

import { Loader } from "@/components/Loader"
import ResetPasswordForm from "@/components/ResetPasswordForm"
import { Suspense } from "react"

export default function ResetPassword() {
    return (
        <Suspense fallback={<Loader />}>
            <ResetPasswordForm />
        </Suspense>
    )
}

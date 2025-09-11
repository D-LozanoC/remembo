import { Loader } from "@/shared/atoms/Loader";
import VerifyEmail from "@/shared/sections/components/VerifyEmail";
import { Suspense } from "react";

export default function VerifyPage() {
    return (
        <Suspense fallback={<Loader />}>
            <VerifyEmail />
        </Suspense>
    )
}

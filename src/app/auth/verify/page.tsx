import { Loader } from "@/components/Loader";
import VerifyEmail from "@/components/VerifyEmail";
import { Suspense } from "react";

export default function VerifyPage() {
    return (
        <Suspense fallback={<Loader />}>
            <VerifyEmail />
        </Suspense>
    )
}

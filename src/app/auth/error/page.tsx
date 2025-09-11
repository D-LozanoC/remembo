import ErrorPage from "@/shared/sections/components/ErrorPage";
import { Loader } from "@/shared/atoms/Loader";
import { Suspense } from "react";

export default function Error() {
    return (
        <Suspense fallback={<Loader />}>
            <ErrorPage />
        </Suspense>
    )
}

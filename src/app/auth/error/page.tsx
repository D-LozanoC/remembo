
import { Loader } from "@/components/Loader";
import ErrorPage from "@/components/ErrorPage";
import { Suspense } from "react";

export default function Error() {
    return (
        <Suspense fallback={<Loader />}>
            <ErrorPage />
        </Suspense>
    )
}

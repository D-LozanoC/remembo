// Components
import AuthLayout from "@/shared/sections/layouts/AuthLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AuthLayout>{children}</AuthLayout>;
}
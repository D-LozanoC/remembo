// Components
import AuthLayout from "@/shared/sections/auth/AuthLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AuthLayout>{children}</AuthLayout>;
}
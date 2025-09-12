import { auth } from '@/auth';
import { MainLayout } from '@/components/MainLayout';
import { SessionProvider } from 'next-auth/react';
import React from 'react'

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth()

    return (
        <SessionProvider session={session}>
            <MainLayout>
                {children}
            </MainLayout>
        </SessionProvider>
    );
}
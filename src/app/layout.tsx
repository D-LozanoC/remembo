import { MainLayout } from '@/components/MainLayout';
import './globals.css'
import { Montserrat } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';


const montserrat = Montserrat({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  return (
    <html lang="en">
      <body className={montserrat.className}>
        <SessionProvider session={session}>
          <MainLayout>{children}</MainLayout>
        </SessionProvider>
      </body>
    </html>
  );
}

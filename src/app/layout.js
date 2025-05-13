import "./globals.css";
import { getServerSession } from 'next-auth';
import ClientSessionProvider from './client-session-provider'; // Create this component

async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body>
        <ClientSessionProvider session={session}>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  );
}

export default RootLayout;

/*
import { SessionProvider } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Corrected path!
import { ReactNode } from 'react';

const SessionProviderWrapper = async ({ children }: { children: ReactNode }) => {
    const session = await getServerSession(authOptions);
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
};

export default async function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <SessionProviderWrapper>
                    {children}
                </SessionProviderWrapper>
            </body>
        </html>
    );
}

*/
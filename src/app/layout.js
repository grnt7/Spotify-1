'use client'; 
import "./globals.css";//this was missing so no css

import { SessionProvider } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

const SessionProviderWrapper = async ({ children }) => {
  const session = await getServerSession(authOptions);
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
};

export default function RootLayout({ children }) { // Removed async
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
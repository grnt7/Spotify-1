'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

const ClientSessionProvider = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
};

export default ClientSessionProvider;


/*
import "./globals.css";
import { getServerSession } from 'next-auth';

async function RootLayout({ children }) {
  const session = await getServerSession();
  console.log("Session in RootLayout:", session); // Add this line

  return (
    <html lang="en">
      <body>
        {/* Temporarily remove ClientSessionProvider }
        {children}
      </body>
    </html>
  );
}

export default RootLayout;

*/

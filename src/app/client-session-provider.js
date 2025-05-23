'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
/*import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';*/
import { Provider } from 'jotai'; // <--- Import Jotai's Provider

const ClientSessionProvider = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
     <Provider>
      {children}
     </Provider>
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

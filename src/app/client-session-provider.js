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




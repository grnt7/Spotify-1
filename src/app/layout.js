import './globals.css';
import { getServerSession } from 'next-auth/next';
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



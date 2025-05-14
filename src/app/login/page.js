// src/app/login/page.js
'use client';

import { useState, useEffect } from 'react';
import { getProviders, signIn } from "next-auth/react";
import Image from 'next/image';

export default function Login() {
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const fetchedProviders = await getProviders();
      setProviders(fetchedProviders);
      console.log("Fetched Providers:", fetchedProviders);
    };

    fetchProviders();
  }, []);

  if (!providers) {
    return <div>Loading providers...</div>; // Or a more user-friendly loading state
  }

  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <Image
        className="w-52 mb-5"
        src="https://links.papareact.com/9xl"
        alt="Spotify Logo"
        width={208}
        height={79}
      />
      
      {providers && Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#18D860] text-white p-5 rounded-full cursor-pointer"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Sign in with {provider.name}
          </button>
        </div>
      ))}
        
       
    </div>
    
  );
}

/*
 <div key={provider.name}>
          <button
            className="bg-[#18D860] text-white p-5 rounded-full"//style guide :spotify green: #18D860
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Sign in with {provider.name}
          </button>
        </div>

*/
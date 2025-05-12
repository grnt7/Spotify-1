"use client"

import { useState, useEffect } from 'react';
import { getProviders, signIn } from 'next-auth/react';




function page  ({providers})  {

  const [providers, setProviders] = useState(null);


 
  return (
    <div className="">
      <img className="w-52 mb-5" src="https://links.papareact.com/9xl" alt="Logo" />
     {Object.values(providers).map((provider) =>
    <div>
      <button>Login with{provider.name}</button>
    </div>
    )}
   
    </div>
  );
};
export default page;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
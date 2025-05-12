'use client';
import {  useSession} from "next-auth/react";

function Center() {
    const {data: session} = useSession();


  return (
    <div className="flex-grow
    text-white" >
       <h1>Iam the Center</h1> 
      <header>
        <div>
            <img className="rounded-full w-10 h-10" 
            src={session?.user.image} alt="" />
        </div>
      </header>
        </div>
  )
}

export default Center
'use client';
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";

function UserInfo()
{
    const {data : session} = useSession();
    const router = useRouter();

    const  handleSignOut = (e) => 
    {
        e.preventDefault();
        router.replace('login')
    }
    return (
        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
                <div>
                    Name : <span className="font-bold">{session?.user?.name}</span>
                </div>
                <div>
                    Email : <span className="font-bold">{session?.user?.email}</span>
                </div>
                <button onClick={ handleSignOut } className="bg-red-500 text-white font-bold px-6 py-2 mt-4">Log Out</button>
            </div>
        </div>
    )
}

export default UserInfo;
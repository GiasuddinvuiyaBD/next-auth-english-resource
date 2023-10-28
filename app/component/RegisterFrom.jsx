"use client"; 

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

function RegisterFrom()
{
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();


    const handleSubmit = async (e) => 
    {
        e.preventDefault();
        
        if(!name || !email || !password)
        {
            setError("All fields are nessary.")
            return
        }

        try{

        const resUserExist = await fetch('api/userExist', {
                method: "POST",
                headers: {
                    "Container-Type" : "application/json"
                },
                body: JSON.stringify({email})
            })
            
            const {user} = await resUserExist.json();

            if(user)
            {
                setError("User Alreay Exist");
                return;
            }
        
        const res = await fetch('api/register', {
                method: "POST",
                headers: {
                    "Container-Type" : "application/json"
                },
                body: JSON.stringify({
                    name, email, password
                })
            })

            if(res.ok)
            {
                const form = e.target;
                form.reset();
                router.push("/");
            }else{
                console.log('user registation failed')
            }
        }catch(error)
        {
            console.log("error during registation", error)
        }
    }

    return (
        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-5 rounded-lg border-t-4 border--400">
               <h2 className="text-xl font-bold my-4">Register</h2>
               <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* i will take three state for input validating. We will take this value into state. for this. For using state we need to convert component into clinet component. For that we will take use clinet at the top of our page.  */}
                    <input onChange={e => setName(e.target.value)} type="text" placeholder="Full Name" />
                    <input onChange={e => setEmail(e.target.value)} type="text" placeholder="Enter Email" />
                    <input onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
                    <button className="bg-blue-600 text-white font-bold cursor-pointer px-6 py-2">
                        Register
                    </button>

                    {error && (
                        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                            {error}
                        </div>
                        )
                    }
                    <Link className="text-sm mt-3 text-right" href={'/'}>Already have an account? 
                    <span className="underline">Login</span></Link>
               </form>
            </div>
        </div>
    )
}

export default RegisterFrom;


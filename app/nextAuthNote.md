## Next Auth Note : 

Install NextAuth: 
```bash
npm install next-auth
# OR
yarn add next-auth

# For this project we will use **mongoose** and **bcryptjs** for hashing password.
```

## `Note :` 
`i will take three state for input validating. We will take this value into state for this. For using state we need to convert component into clinet component. For that we will take **use clinet** at the top of our page.`


**our projects registation code.**
```bash
# form validation.
    const handleSubmit = (e) => 
    {
        e.preventDefault();
        if(!name || !email || !password)
        {
            setError("All fields are nessary.")
            return
        }
    }

return(
<input onChange={e => setName(e.target.value)} type="text" placeholder="Full Name" />
)
                    
```

`Note: In NextJS13 for api file we will call route.jsx for other file we will create page.js **api>register>route.js**`


## Part-3: Now will add our data to the database MongoDB. 

For doing this we have to register at mogoDB then create a project after that we will create password then we will connect mogodb with vs code after that we will take the link and then we will set the password into the link. Atfter words we will store it to the .env file. after all thing doing we will ignore .env file to gitignore file.

Now we will connect our data to mogoDB. For that we will create a folder call **lip** inside that we will create afile call **mongodb.js**.

```js
import mongoose from "mongoose";

export const connectMongoDB = async () => 
{
    try
    {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('conneted to mongoDB')
    }catch(error)
    {
        console.log('Error connecting to mongoDB : ', error)
    }
}

```

Now we will create a schema for the user data.
- firt create a folder.
- then create a file call users.js

Making schema.
```js
import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
}, {timestamps : true});

// {timestamps : true} when our data will add it will set the time.

const User = models.User || mongoose.model("User", userSchema);
export default User;
```


Now we will pass data to mongoDB form route.js.

```js
    try
    {
      const {name, email, password} = await req.json();
      // passing data to mongoDB. 
      // we will make our password by hash.
      const hashPassword = await bcrypt.hash(password, 10)
      await connectMongoDB()
      await User.create({name,email, password : hashPassword})
      // if everything is ok then we will return next response.
      return NextResponse.json(
      {message : "user register."},
      {status : 201})
    }
```

Now we will check if any user pass the name email for register in this situation we will show an error message. For this we will create another folder inside the api. 



<!-- 
========================= Next Auth =========================
 -->
 ## Now We will see the functionality by using `Next Auth`.

Inside the api folder i will create a folder call **auth** inside of it i will create another folder call **[...nextauth]** and then i will create a file call route.js.

I will use **CredentialsProvider** for email and password.

```js
import NextAuth from "next-auth/next";
import nextAuth from "next-auth/next";
import CredentialsProvider  from "next-auth/providers/credentials";

const authOptions = 
{
    providers: [
        CredentialsProvider({
            name : "credentials",
            credentials : {},

            async authorize(credentials)
            {
                const user = {id : '1'}
                return user
            }
        })
    ],
    // now we will check if anyone send us any wrong password or email.
    session: {
        strategy : "jwt",
    },
    screat: process.env.NEXTAUTH_SECREAT,
    pages: {
        signIn : '/'
    },
}

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST}

```
I have to understand this page after finishing the class. 

## We need to wrap the while app by seession provider for nextAuth.

Layout.js file wrap our whole app. now will create another file for wrap our whole app and also we will create it by using **"use clinet"**. we need use clinet component for that.

For that we will create a new file call **provider.js**


```js
// Eiter maddome ami data pass korci  AuthProvider
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
```

```js
// eitar maddome ami sessionProvider er bitor wrap kora dice children k.
'use client';
import {SessionProvider}  from 'next-auth/react';

export const AuthProvider = ({children}) => 
{
    return <SessionProvider>{children}</SessionProvider>
}
```

Now we will be able to use function inside the nextAuth.


Now We are going to **Login page**. At first we will convert it inot client component becuase we gonna use some user interation.

**Our Login page**
```js
'use client';
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Righteous } from "next/font/google";

function LoginForm()
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 
    const router = useRouter();

    const handleSubmit = async (e) => 
    {
        e.preventDefault(); 

        try{
            const res = await signIn('credentials',{
                email,
                password,
                redirect : false
            })

            if(res.error)
            {
                setError("Invalide Credential");
                return;
            }
            
            router.replace("dashbord")
        }catch(error)
        {
            console.log(error)
        }
    }

    return (
        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
               <h2 className="text-xl font-bold my-4">Login</h2>

               <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Enter Email" />
                    <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                    <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
                        Login
                    </button>
                    {error &&                        
                    <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                        {error}
                    </div>
                    }

                    <Link className="text-sm mt-3 text-right" href={'/register'}>Don't have an account? 
                    <span className="underline">Register</span></Link>
               </form>
            </div>
        </div>
    )
}
export default LoginForm
```


## Now we will do SignOut functionality.
For that we will go to deshbord  then we will add signOut function form next auth.

after that i will set an event call onClick form the singOut button. 
For doing it's functionality i will create another file call middleware.


` For Showing data into dashbord we need to take useSession form next-auth/react`.

```js
'use client';
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

function UserInfo()
{
    const {data : session} = useSession();
    return (
        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
                <div>
                    Name : <span className="font-bold">{session?.user?.name}</span>
                </div>
                <div>
                    Email : <span className="font-bold">{session?.user?.email}</span>
                </div>
                <button onClick={() => signOut()} className="bg-red-500 text-white font-bold px-6 py-2 mt-4">Log Out</button>
            </div>
        </div>
    )
}
```

When we will login then we will go to our dashbord. When we will complete our login then we can't go to our registation page and login page by using.


Now inside the Registation page we will check we are loged in our not. For that we need to import **getServerSession** and also we neet to import **rediract** from next/navigate.



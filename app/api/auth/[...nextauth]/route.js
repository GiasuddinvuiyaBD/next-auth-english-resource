import { connectMongoDB } from "@/app/lip/mongodb";
import User from "@/app/models/users";
import NextAuth from "next-auth/next";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";


export const authOptions = 
{
    providers: [
        CredentialsProvider({
            name : "credentials",
            credentials : {},

            async authorize(credentials)
            {
                const {email, password} = credentials;

                try{
                    await connectMongoDB();
                    const user = await User.findOne({email})

                    if(!user)
                    {
                        return null;
                    }
        
                    let passwordMatch = await bcrypt.compare(password, user.password);
                    console.log(user.password)
                    // password !== user.password
                    if (!passwordMatch) {
                      return null;
                    }
                    return user;

                }catch(error)
                {
                    console.log(error);
                }
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


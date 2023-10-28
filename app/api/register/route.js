import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lip/mongodb";
import User from "@/app/models/users";
import bcrypt from "bcryptjs";
export async function POST(req)
{


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
    }catch(error)
    {
        return NextResponse.json(
        {message : "An error occurred while registaring user."}, 
        {status : 500})
    }
}




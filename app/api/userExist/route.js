import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lip/mongodb";
import User from "@/app/models/users";
import { connection } from "mongoose";

export async function POST(req){
    try{
        await connectMongoDB();
        const {email} = await req.json();
        const user = await User.findOne({email}).select("_id");
        console.log("user :", user);

        return NextResponse.json({user})
    }catch(error)
    {
        console.log(error)
    }
}

// now registerFrom a gial data pass korbo
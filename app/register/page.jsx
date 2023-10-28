import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import RegisterFrom from "../component/RegisterFrom"; 
import { authOptions } from "../api/auth/[...nextauth]/route";

async function  Register ()
{
    const session = await getServerSession(authOptions); 
    if(session) redirect('/dashbord')
    
    return <RegisterFrom />
}

export default Register
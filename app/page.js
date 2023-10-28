import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "./component/LoginForm";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default function Home() {
  const session = getServerSession(authOptions); 

  if(session)  redirect('/dashbord')
  return <main>
    <LoginForm />
  </main>
}

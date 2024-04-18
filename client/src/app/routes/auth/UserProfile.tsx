import BigText from "@/components/BigText";
import { auth } from "@src/auth";
import Title from "@/components/Title.tsx";
import {LogoutButton} from "@/components/Auth/LogoutButton.tsx";

export default async function UserProfile({ dict }: { dict: any }) {
    const session = await auth()

    if(!session?.user) return null

    console.log(session)

  return (
    <div className="flex flex-1 flex-col justify-center items-center h-full">
        <Title text="Logged in!" />
        <p>Hi, {session.user.name}!</p>
        <LogoutButton text={"Wyloguj się"} />
    </div>
  );
}

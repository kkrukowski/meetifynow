import {auth, signOut} from "@src/auth";
import Title from "@/components/Title.tsx";
import {LogoutButton} from "@/components/Auth/LogoutButton.tsx";
import {Locale} from "@root/i18n.config.ts";
import {logout} from "@/api/logout.ts";

export default async function UserProfile({ lang, dict }: { lang: Locale, dict: any }) {
    const session = await auth()
    if(!session?.user) return null

    console.log(session)

  return (
      <div className="flex flex-1 flex-col justify-center items-center h-full">
          <Title text="Logged in!"/>
          <p>Hi, {session.user.name}!</p>
          <LogoutButton text={"Wyloguj się"} />
      </div>
  );
}

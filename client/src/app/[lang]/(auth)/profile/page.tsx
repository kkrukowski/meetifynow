import {Locale} from "@root/i18n.config.ts";
import {getDictionary} from "@/lib/dictionary.ts";
import UserProfile from "@/routes/auth/UserProfile.tsx";
import {auth} from "@src/auth.ts";
import {redirect} from "next/navigation";

export default async function Page({params: { lang }}: { params: { lang: Locale }}) {
    const session = await auth()
    if (!session?.user) return redirect("/login")

    const dict = await getDictionary(lang);

    return (
        <UserProfile lang={lang} dict={dict}/>
    )
}
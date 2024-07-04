import RegisterPage from '@/routes/auth/RegisterPage';
import {Locale} from "@root/i18n.config.ts";
import {getDictionary} from "@/lib/dictionary.ts";
import {auth} from "@src/auth.ts";
import {redirect} from "next/navigation";
import VerifyEmail from "@/routes/auth/VerifyEmail.tsx";
import {useLocation} from "react-router-dom";
import {verifyEmail} from "@/api/verifyemail.ts";

export default async function Page({params: { lang }}: { params: { lang: Locale } }) {
    const session = await auth()
    if (session?.user) return redirect("/profile")
    const dict = await getDictionary(lang)

    return (
        <VerifyEmail dict={dict}/>
    )
}
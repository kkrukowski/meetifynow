import LoginPage from '@/routes/auth/LoginPage';
import {Locale} from "@root/i18n.config.ts";
import {getDictionary} from "@/lib/dictionary.ts";
import {auth} from "@src/auth.ts";
import { redirect } from 'next/navigation'

export default async function Page({params: { lang }}: { params: { lang: Locale }; }) {
    const session = await auth()
    if (session?.user) return redirect("/profile")

    const dict = await getDictionary(lang);

    return (
        <LoginPage dict={dict} lang={lang} />
    )
}
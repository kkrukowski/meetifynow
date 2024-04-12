import RegisterPage from '@/routes/auth/RegisterPage';
import {Locale} from "@root/i18n.config.ts";
import {getDictionary} from "@/lib/dictionary.ts";

export default async function Page({
                                 params: { lang },
                             }: {
    params: { lang: Locale };
}) {
    const dict = await getDictionary(lang);

    return (
        <RegisterPage dict={dict}/>
    )
}
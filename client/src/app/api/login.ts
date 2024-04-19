"use server"

import { LoginInputs } from "@/inputs";
import { signIn } from "@src/auth.ts"
import { Locale } from "@root/i18n.config.ts";

export const login = async (values: LoginInputs, lang: Locale) => {
    await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: true,
        redirectTo: `/${lang}/profile`
    })
}
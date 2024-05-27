"use server"

import { LoginInputs } from "@/inputs";
import { signIn } from "@src/auth.ts"
import { Locale } from "@root/i18n.config.ts";
import axios from "axios";

export const login = async (values: LoginInputs, lang: Locale) => {
    const isUserExists = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/user/email/${values.email}`)

    if (isUserExists.data.statusCode === 404) {
        return {
            message: 'User not found!',
            statusCode: 404,
        };
    }

    return await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: true,
        redirectTo: `/${lang}/profile`
    })
}
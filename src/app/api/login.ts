"use server"

import { LoginInputs } from "@/inputs";
import { signIn } from "@src/auth.ts"
import { Locale } from "@root/i18n.config.ts";
import axios from "axios";

export const login = async (values: LoginInputs, lang: Locale) => {
    if (!values) {
        console.error("No data provided!")
        return {
            message: 'No data provided!',
            statusCode: 400,
        };
    }

    const isUserValidate = await axios.post(process.env.NEXT_PUBLIC_SERVER_URL + `/auth/validate`, {email: values.email, password: values.password})

    if (isUserValidate.data.statusCode !== 200) {
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
"use server"

import { LoginInputs } from "@/inputs";
import { signIn } from "@src/auth.ts"

export const login = async (values: LoginInputs) => {
    await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: true,
        redirectTo: "/profile"
    })
}
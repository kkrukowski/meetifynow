"use server"

import { RegisterInputs } from "@/inputs";
import axios from "axios";

export const register = async (values: RegisterInputs) => {
    const registerUrl = process.env.NEXT_PUBLIC_SERVER_URL + "/auth/register";

    const res = await axios.post(registerUrl, values)
        .then((res) => {
            return res.data
        })

    return res
}
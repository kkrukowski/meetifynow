"use server"

import { LoginInputs } from "@/inputs";
import axios from "axios";

export const login = async (values: LoginInputs) => {
    const loginUrl = process.env.NEXT_PUBLIC_SERVER_URL + "/auth/login";
    const res = await axios.post(loginUrl, values)
        .then((res) => {
            return res.data
        })

    return res
}
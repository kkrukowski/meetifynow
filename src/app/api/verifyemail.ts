"use server"

import axios from "axios";

export const verifyEmail = async (emailToken: string) => {
    const verifyEmailUrl = process.env.NEXT_PUBLIC_SERVER_URL + "/auth/verify-email/" + emailToken;

    const res = await axios.post(verifyEmailUrl)
        .then((res) => {
            return res.data
        })

    return res
}
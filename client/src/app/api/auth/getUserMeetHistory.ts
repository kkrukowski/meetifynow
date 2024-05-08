"use server"

import axios from "axios";

export const getUserMeetHistory = async (id: string, token: string) => {
    const url = process.env.NEXT_PUBLIC_SERVER_URL + `/user/${id}`;
    const res = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
            return res.data.user.appointments
        })

    return res
}
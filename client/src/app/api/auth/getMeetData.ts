"use server"

import axios from "axios";

export const getMeetData = async (id: string, token: string) => {
    const url = process.env.NEXT_PUBLIC_SERVER_URL + `/meet/db/${id}`;

    const res = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        return res.data
    })

    return res
}
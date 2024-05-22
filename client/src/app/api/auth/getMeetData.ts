"use server"

import axios from "axios";

export const getMeetData = async (id: string[], token: string) => {
    const url = process.env.NEXT_PUBLIC_SERVER_URL + `/meet/db/many`

    const res = await axios.post(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: {
            id: id
        }
    }).then((res) => {
        return res.data
    })

    return res
}
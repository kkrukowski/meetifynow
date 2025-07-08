"use server"

import { signOut } from "@src/auth.ts"

export const logout = async () => {
    console.log("Logging out")
    return await signOut()
}
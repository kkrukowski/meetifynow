"use server"

import { signOut } from "@src/auth.ts"

export const logout = async () => {
    return await signOut()
}
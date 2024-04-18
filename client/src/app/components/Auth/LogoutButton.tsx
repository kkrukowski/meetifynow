"use client"

import React from "react";
import { logout } from "@/api/logout.ts"

export const LogoutButton = ({text}) => {
    const logoutHandler = () => {
        console.log("Logging out")
        logout()
    }

    return (
        <button
            className={
                `bg-red hover:bg-red-hover active:bg-red-active text-light font-medium w-fit px-4 py-2 rounded-lg mt-5 self-center transition-colors`
            }
            onClick={logoutHandler}
        >
            Wyloguj się
        </button>
    );
}
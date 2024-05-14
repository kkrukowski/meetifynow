"use client"

import {logout} from "@/api/logout.ts";

interface LogoutButtonProps {
    text: string;
}

export const LogoutButton = (props: LogoutButtonProps) => {

    const logoutHandler = async () => {
        await logout()
    }

    return (
        <button
            className={
                `bg-red hover:bg-dark-red active:bg-red-active text-light font-medium w-fit px-4 py-2 rounded-lg mt-5 self-center transition-colors`
            }
            onClick={logoutHandler}
        >
            {props.text}
        </button>

    );
}
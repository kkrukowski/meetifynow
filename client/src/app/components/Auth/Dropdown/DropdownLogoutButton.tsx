"use client"

import {logout} from "@/api/logout.ts";

interface LogoutButtonProps {
    text: string;
}

export const DropdownLogoutButton = (props: LogoutButtonProps) => {

    const logoutHandler = async () => {
        await logout()
    }

    return (
        <button
            className={
                `cursor-pointer bg-red hover:bg-dark-red active:bg-red-active text-light text-base font-medium w-full py-1 rounded-lg self-center transition-colors`
            }
            onClick={logoutHandler}
        >
            {props.text}
        </button>

    );
}
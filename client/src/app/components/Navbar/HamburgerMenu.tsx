"use client"

import {useState} from "react";
import Link from "next/link";
import {FaUser} from "react-icons/fa6";
import {Locale} from "@root/i18n.config.ts";
import {getDictionary} from "@/lib/dictionary.ts";
import {FaUserCircle} from "react-icons/fa";
import {LogoutButton} from "@/components/Auth/LogoutButton.tsx";
import {LoginButton} from "@/components/Auth/LoginButton.tsx";

type HamburgerMenuProps = {
    sessionUser: any;
    dict: any;
}

export default function HamburgerMenu(props: HamburgerMenuProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    }

    return (
        <div className={`md:relative`}>
            <button onClick={handleClick}
                    className="relative flex-col justify-center items-center cursor-pointer p-2 z-50">
                    <span className={`bg-dark block transition-all duration-300 ease-out 
                                    h-1 w-8 rounded-sm ${isOpen ?
                        'rotate-45 translate-y-2' : '-translate-y-0.5'
                    }`}>
                    </span>
                <span className={`bg-dark block transition-all duration-300 ease-out 
                                    h-1 w-8 rounded-sm my-0.5 ${isOpen ?
                    'opacity-0' : 'opacity-100'
                }`}>
                    </span>
                <span className={`bg-dark block transition-all duration-300 ease-out
                                    h-1 w-8 rounded-sm ${isOpen ?
                    '-rotate-45 -translate-y-1' : 'translate-y-0.5'
                }`}>
                    </span>
            </button>

            <div
                className={`absolute z-40 flex flex-col items-center top-0 left-0 w-screen md:w-[400px] h-screen bg-light md:border-l-[1px] md:border-light-active duration-300 ease-out transition-all ${
                    isOpen ? 'opacity-100 md:translate-x-[-330px]' : 'md:opacity-0 translate-x-[600px] sm:translate-x-[800px] md:translate-x-0'
                }`}
            >
                <div className={`mt-[100px] flex flex-col items-center`}>
                    {/* User info */}
                    <div className={`flex items-center justify-center mb-5`}>
                        {props.sessionUser && (<Link href={`/profile`} onClick={closeMenu} className="flex items-center w-full">
                            <FaUserCircle className={`text-dark text-5xl mr-5`}/>
                        </Link>)}
                        <div>
                            <p className={`text-dark text-base font-medium`}>
                                {props.sessionUser ? <div>
                                    <p>{props.sessionUser.name}</p>
                                    <p>{props.sessionUser.email}</p>
                                </div> : <LoginButton text={props.dict.page.login.button.login} mode="redirect" />}
                            </p>
                        </div>
                    </div>
                    <div className={`w-[300px] rounded-lg h-[1px] bg-light-active`}></div>
                    {/* Main items */}
                    <div className={`flex flex-col items-center`}>
                        <Link
                            href={"/"}
                            onClick={closeMenu}
                            className={`text-primary text-xl hover:text-primary-hover active:text-primary-active font-medium p-3`}
                        >
                            Strona główna
                        </Link>
                        <Link
                            href={"/meet/new"}
                            onClick={closeMenu}
                            className={`text-primary text-xl hover:text-primary-hover active:text-primary-active font-medium p-3`}
                        >
                            Nowe spotkanie
                        </Link>
                    </div>
                    {/* Auth items */}
                    {props.sessionUser && (
                    <div className={`flex flex-col items-center`}>
                        <Link
                            href={"/profile"}
                            onClick={closeMenu}
                            className={`text-primary text-xl hover:text-primary-hover active:text-primary-active font-medium p-3`}
                        >
                            <span>{props.dict.page.auth.hamburgerMenu.profile}</span>
                        </Link>
                        <LogoutButton text={props.dict.page.auth.hamburgerMenu.logout}/>
                    </div>
                    )}
                </div>
            </div>
        </div>
    )
}
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Locale} from "@root/i18n.config.ts";
import {getDictionary} from "@/lib/dictionary.ts";

import { FaUser, FaAngleDown } from "react-icons/fa6";
import Link from "next/link";
import {LogoutButton} from "@/components/Auth/LogoutButton.tsx";
import {logout} from "@/api/logout.ts";
import {DropdownLogoutButton} from "@/components/Auth/Dropdown/DropdownLogoutButton.tsx";

type UserDropdownMenuProps = {
    sessionUser: any;
    lang: Locale
}

export default async function UserDropdownMenu(props : UserDropdownMenuProps) {
    const dict = await getDictionary(props.lang);

    const logoutHandler = async () => {
        await logout()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center text-lg px-2">
                <span>{props.sessionUser.name}</span>
                <FaAngleDown className="ml-2" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer text-base">
                    <Link href={`/${props.lang}/profile`} className="flex items-center">
                        <FaUser className="mr-2" />
                        <span>{dict.page.auth.userDropdownMenu.profile}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownLogoutButton text={dict.page.auth.userDropdownMenu.logout} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
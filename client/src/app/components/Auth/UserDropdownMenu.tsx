import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Locale} from "@root/i18n.config.ts";
import {getDictionary} from "@/lib/dictionary.ts";

import { FaUser, FaAngleDown, FaPlus } from "react-icons/fa6";
import Link from "next/link";
import {DropdownLogoutButton} from "@/components/Auth/Dropdown/DropdownLogoutButton.tsx";

type UserDropdownMenuProps = {
    sessionUser: any;
    lang: Locale
}

export default async function UserDropdownMenu(props : UserDropdownMenuProps) {
    const dict = await getDictionary(props.lang);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center text-lg px-2">
                <span>{props.sessionUser.name}</span>
                <FaAngleDown className="ml-2" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer text-base">
                    <Link href={`/${props.lang}/profile`} className="flex items-center w-full">
                        <FaUser className="mr-2" />
                        <span>{dict.page.auth.userDropdownMenu.profile}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-base">
                    <Link href={`/${props.lang}/meet/new/`} className="flex items-center">
                        <FaPlus className="mr-2" />
                        <span>{dict.page.auth.userDropdownMenu.createMeeting}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownLogoutButton text={dict.page.auth.userDropdownMenu.logout} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
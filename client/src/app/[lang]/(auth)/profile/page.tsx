import {Locale} from "@root/i18n.config.ts";
import {getDictionary} from "@/lib/dictionary.ts";
import UserProfile from "@/routes/auth/UserProfile.tsx";
import {auth} from "@src/auth.ts";
import {redirect} from "next/navigation";
import {getUserMeetHistory} from "@/api/auth/getUserMeetHistory.ts";
import {getMeetData} from "@/api/auth/getMeetData.ts";

export default async function Page({params: { lang }}: { params: { lang: Locale }}) {
    const session = await auth()
    if (!session?.user) return redirect("/login")

    const accessToken = session.tokens.access_token

    const userMeetHistory = await getUserMeetHistory(session.user._id, accessToken);

    const userMeetData = await getMeetData(userMeetHistory, accessToken)

    const dict = await getDictionary(lang);

    return (
        <UserProfile lang={lang} dict={dict} meetHistory={userMeetData}/>
    )
}
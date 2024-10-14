import {auth} from "@src/auth";
import Title from "@/components/Title.tsx";
import {Locale} from "@root/i18n.config.ts";
import MeetHistoryList from "@/components/UserProfile/MeetHistoryList.tsx";
import UserInfoField from "@/components/UserProfile/UserInfoField.tsx";
import Heading from "@/components/Heading.tsx";
import {WarningToast} from "@/components/WarningToast.tsx";

export default async function UserProfile({ dict, meetHistory }: { lang: Locale, dict: any, meetHistory: any }) {
    const session = await auth()
    if(!session?.user) return null

  return (
      <main className="flex flex-1 flex-col justify-center items-center h-full px-5 pb-10 pt-24 md:pt-28">
          <Title text={dict.page.profile.title}/>
          <WarningToast text={"This page is under construction"}/>
          <section className="flex-col lg:flex-row flex h-full">
              {/* User Info */}
              <section>
                  <Heading text={dict.page.profile.userInfo.title}/>
                  <div>
                      <UserInfoField fieldName={dict.page.profile.userInfo.name} fieldValue={session.user.name}/>
                      <UserInfoField fieldName={dict.page.profile.userInfo.email} fieldValue={session.user.email}/>
                  </div>
              </section>

              <div className="h-0.5 lg:h-[200px] w-full lg:w-0.5 bg-dark rounded-full my-10 lg:mx-10"></div>

              {/* Meet History */}
              <section>
                  {meetHistory == null ? <p>{dict.page.profile.meetings.noMeetings}</p> :
                      <MeetHistoryList meetList={meetHistory} title={dict.page.profile.meetings.title}/>}
              </section>
          </section>
      </main>
  );
}

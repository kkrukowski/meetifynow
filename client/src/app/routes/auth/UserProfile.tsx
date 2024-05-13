import {auth} from "@src/auth";
import Title from "@/components/Title.tsx";
import {Locale} from "@root/i18n.config.ts";
import MeetHistoryList from "@/components/UserProfile/MeetHistoryList.tsx";
import UserInfoField from "@/components/UserProfile/UserInfoField.tsx";
import Heading from "@/components/Heading.tsx";

export default async function UserProfile({ lang, dict, meetHistory }: { lang: Locale, dict: any, meetHistory: any }) {
    const session = await auth()
    if(!session?.user) return null

  return (
      <div className="flex flex-1 flex-col justify-center items-center h-full">
          <Title text="Profil użytkownika"/>
          <main className="flex h-full">
              {/* User Info */}
              <section>
                  <Heading text={"Informacje o użytkowniku"} />
                  <div>
                    <UserInfoField fieldName={"Nazwa"} fieldValue={session.user.name} />
                    <UserInfoField fieldName={"Email"} fieldValue={session.user.email} />
                  </div>
              </section>

              <div className="h-[200px] w-0.5 bg-dark rounded-full mx-10"></div>

              {/* Meet History */}
              <section>
                  { meetHistory == null ? <p>Brak spotkań.</p> : <MeetHistoryList meetList={meetHistory}/> }
              </section>
          </main>
      </div>
  );
}

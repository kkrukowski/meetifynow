import MeetHistoryItem from "@/components/UserProfile/MeetHistoryItem.tsx";
import Heading from "@/components/Heading.tsx";

export default function MeetHistoryList ({meetList}: { meetList: any[] }) {
    console.log(meetList)

    return (
        <div>
            <Heading text={"Poprzednie spotkania"} />
            <section className="max-h-[300px]">

            </section>
            {meetList.map((meet) => (
                <MeetHistoryItem />
            ))}
        </div>
    )
}
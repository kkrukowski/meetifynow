import MeetHistoryItem from "@/components/UserProfile/MeetHistoryItem.tsx";
import Heading from "@/components/Heading.tsx";

export default function MeetHistoryList ({meetList}: { meetList: any[] }) {
    console.log(meetList)

    return (
        <div>
            <Heading text={"Poprzednie spotkania"} />
            <ul className="max-h-[350px] overflow-auto">
                {meetList.map((meet) => (
                    <MeetHistoryItem meetId={meet.appointmentId} meetName={meet.meetName} meetPlace={meet.meetPlace} />
                ))}
            </ul>

        </div>
    )
}